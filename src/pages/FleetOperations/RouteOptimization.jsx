// src/pages/Administration/RouteOptimization.jsx
import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardBody,
    Button,
    Input,
    Select,
    Option,
    Typography,
} from "@material-tailwind/react";
import { GoogleMap, Polygon, InfoWindow } from "@react-google-maps/api";

// ----- CONFIGURATION -----
const containerStyle = {
    width: "100%",
    height: "100%",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

// ----- HELPER FUNCTION -----
// Create a circular polygon for given center and radius (in km).
const createCircle = (center, radiusInKm, numPoints = 64) => {
    if (
        window.google &&
        window.google.maps &&
        window.google.maps.geometry &&
        window.google.maps.geometry.spherical &&
        typeof window.google.maps.geometry.spherical.computeOffset === "function"
    ) {
        const centerLatLng = new window.google.maps.LatLng(center.lat, center.lng);
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const heading = i * (360 / numPoints);
            const point = window.google.maps.geometry.spherical.computeOffset(
                centerLatLng,
                radiusInKm * 1000, // convert km to meters
                heading
            );
            points.push({ lat: point.lat(), lng: point.lng() });
        }
        return points;
    } else {
        const earthRadius = 6371; // km
        const points = [];
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i * 360) / numPoints;
            const radians = (Math.PI / 180) * angle;
            const dx = (radiusInKm / earthRadius) * Math.cos(radians);
            const dy = (radiusInKm / earthRadius) * Math.sin(radians);
            const newLat = center.lat + (dy * 180) / Math.PI;
            const newLng =
                center.lng + (dx * 180) / (Math.PI * Math.cos((center.lat * Math.PI) / 180));
            points.push({ lat: newLat, lng: newLng });
        }
        return points;
    }
};

export default function RouteOptimization() {
    // States for geofences and form fields
    const [geofences, setGeofences] = useState([]);
    const [sourceLocation, setSourceLocation] = useState("");
    const [destinationLocation, setDestinationLocation] = useState("");
    const [waypoints, setWaypoints] = useState([]);
    const [vehicleType, setVehicleType] = useState("");
    const [dateTime, setDateTime] = useState("");
    const [error, setError] = useState("");
    const token = localStorage.getItem("authToken");

    // Additional state to hold selected geofence objects for map display.
    const [selectedSourceGf, setSelectedSourceGf] = useState(null);
    const [selectedDestinationGf, setSelectedDestinationGf] = useState(null);
    const [selectedWaypointsGf, setSelectedWaypointsGf] = useState([]);

    // State for route list
    const [routes, setRoutes] = useState([]);

    // Reference to the Google Map instance
    const mapRef = useRef(null);

    // ----- FETCH GEOFENCES -----
    useEffect(() => {
        async function fetchGeofences() {
            try {
                const response = await fetch("https://api.veyza.in/veyza-api/v0/geofences", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch geofences");
                }
                const data = await response.json();
                // Format geofence data: try to use gf.name, then gf.group_name, fallback to "Unnamed Geofence".
                const formatted = data.map((gf) => ({
                    _id: gf._id,
                    name: (gf.name || gf.group_name) || "Unnamed Geofence",
                    lat: Number(gf.lat),
                    lng: Number(gf.long), // expecting backend returns "long"
                    radius: Number(gf.radius),
                    distance_unit: gf.distance_unit,
                }));
                setGeofences(formatted);
            } catch (err) {
                console.error("Error fetching geofences:", err);
                setError(err.message);
            }
        }
        fetchGeofences();
    }, [token]);

    // ----- FETCH ROUTES -----
    useEffect(() => {
        async function fetchRoutes() {
            try {
                const response = await fetch("https://api.veyza.in/veyza-api/v0/routes", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": token ? `Bearer ${token}` : "",
                    },
                });
                if (!response.ok) {
                    throw new Error("Failed to fetch routes");
                }
                const data = await response.json();
                setRoutes(data);
            } catch (err) {
                console.error("Error fetching routes:", err);
            }
        }
        fetchRoutes();
    }, [token]);

    // ----- HANDLERS FOR DROPDOWNS -----
    const handleSourceChange = (value) => {
        setSourceLocation(value);
        const gf = geofences.find((g) => g._id === value);
        setSelectedSourceGf(gf);
        if (mapRef.current && gf) {
            mapRef.current.panTo({ lat: gf.lat, lng: gf.lng });
            mapRef.current.setZoom(12);
        }
    };

    const handleDestinationChange = (value) => {
        setDestinationLocation(value);
        const gf = geofences.find((g) => g._id === value);
        setSelectedDestinationGf(gf);
        if (mapRef.current && gf) {
            mapRef.current.panTo({ lat: gf.lat, lng: gf.lng });
            mapRef.current.setZoom(12);
        }
    };

    // For waypoints, using a native multiple select input
    const handleWaypointsChange = (e) => {
        const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
        setWaypoints(selectedOptions);
        // Also save full objects
        const selectedGfs = geofences.filter((g) => selectedOptions.includes(g._id));
        setSelectedWaypointsGf(selectedGfs);
    };

    const handleVehicleTypeChange = (value) => {
        setVehicleType(value);
    };

    const handleDateTimeChange = (e) => {
        setDateTime(e.target.value);
    };

    // ----- SUBMIT ROUTE -----
    const handleSubmit = async () => {
        const selectedSource = geofences.find((g) => g._id === sourceLocation);
        const selectedDestination = geofences.find((g) => g._id === destinationLocation);
        const routeName =
            selectedSource && selectedDestination
                ? `Route from ${selectedSource.name} to ${selectedDestination.name}`
                : "Route";

        const payload = {
            name: routeName,
            source: sourceLocation,          // a geofence ID
            destination: destinationLocation, // a geofence ID
            waypoints: waypoints,             // an array of geofence IDs (can be empty)
            vehicleType,
            scheduledAt: dateTime,
        };

        try {
            const response = await fetch("https://api.veyza.in/veyza-api/v0/routes/create-route", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const errData = await response.json();
                throw new Error(errData.message || "Failed to create route");
            }
            const result = await response.json();
            console.log("Route created successfully:", result);
            alert("Route created successfully!");
            // Optionally, refresh the route list
            const refreshedRoutesResponse = await fetch("https://api.veyza.in/veyza-api/v0/routes", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": token ? `Bearer ${token}` : "",
                },
            });
            const refreshedRoutes = await refreshedRoutesResponse.json();
            setRoutes(refreshedRoutes);

            // Reset form fields
            setSourceLocation("");
            setDestinationLocation("");
            setVehicleType("");
            setDateTime("");
            setWaypoints([]);
            setSelectedSourceGf(null);
            setSelectedDestinationGf(null);
            setSelectedWaypointsGf([]);
        } catch (err) {
            console.error("Error creating route:", err);
            alert("Error: " + err.message);
        }
    };

    // ----- RENDER ROUTES TABLE -----
    const renderRoutesTable = () => {
        if (!routes || routes.length === 0) {
            return <p className="text-gray-500 p-4">No routes available</p>;
        }
        return (
            <div className="overflow-x-auto mt-6">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-blue-gray-50">
                            <th className="p-3">Route Name</th>
                            <th className="p-3">Source</th>
                            <th className="p-3">Destination</th>
                            <th className="p-3">Vehicle Type</th>
                            <th className="p-3">Scheduled At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {routes.map((route, idx) => (
                            <tr key={idx} className={idx % 2 === 1 ? "bg-blue-gray-50/50" : ""}>
                                <td className="p-3">{route.name}</td>
                                <td className="p-3">
                                    {route.sourceDetails ? route.sourceDetails.name : route.source}
                                </td>
                                <td className="p-3">
                                    {route.destinationDetails ? route.destinationDetails.name : route.destination}
                                </td>
                                <td className="p-3">{route.vehicleType}</td>
                                <td className="p-3">{new Date(route.scheduledAt).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="p-4">
            <Typography variant="h4" className="mb-4">Route Optimization</Typography>
            <div className="flex flex-col md:flex-row gap-4">
                {/* Left Side: Form */}
                <Card className="w-full md:w-1/3">
                    <CardBody>
                        {/* Source Geofence Select */}
                        <div className="mb-4">
                            <Select label="Select Source Geofence" value={sourceLocation} onChange={handleSourceChange}>
                                {geofences.map((gf) => (
                                    <Option key={gf._id} value={gf._id}>
                                        {gf.name || gf.group_name || "Unnamed Geofence"}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Destination Geofence Select */}
                        <div className="mb-4">
                            <Select label="Select Destination Geofence" value={destinationLocation} onChange={handleDestinationChange}>
                                {geofences.map((gf) => (
                                    <Option key={gf._id} value={gf._id}>
                                        {gf.name || gf.group_name || "Unnamed Geofence"}
                                    </Option>
                                ))}
                            </Select>
                        </div>

                        {/* Waypoints: Native multi-select */}
                        <div className="mb-4">
                            <label className="block text-sm text-blue-gray-700 mb-1">Select Waypoints</label>
                            <select
                                multiple
                                value={waypoints}
                                onChange={handleWaypointsChange}
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                            >
                                {geofences.map((gf) => (
                                    <option key={gf._id} value={gf._id}>
                                        {gf.name || gf.group_name || "Unnamed Geofence"}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Select Vehicle Type */}
                        {/* <div className="mb-4">
                            <Select label="Select Vehicle Type" value={vehicleType} onChange={handleVehicleTypeChange}>
                                <Option value="Car">Car</Option>
                                <Option value="Jeep">Jeep</Option>
                                <Option value="Van">Van</Option>
                                <Option value="SUV">SUV</Option>
                            </Select>
                        </div> */}

                        {/* Date & Time */}
                        <div className="mb-4">
                            <Input label="Date & Time" type="datetime-local" value={dateTime} onChange={handleDateTimeChange} />
                        </div>

                        {/* Submit Button */}
                        <div className="mb-4">
                            <Button color="blue" onClick={handleSubmit} className="w-full">
                                Submit
                            </Button>
                        </div>
                    </CardBody>
                </Card>

                {/* Right Side: Map */}
                <Card className="flex-1">
                    <CardBody className="relative h-96">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={defaultCenter}
                            zoom={6}
                            onLoad={(map) => (mapRef.current = map)}
                        >
                            {/* Source Polygon */}
                            {selectedSourceGf && (
                                <Polygon
                                    path={createCircle(
                                        { lat: selectedSourceGf.lat, lng: selectedSourceGf.lng },
                                        selectedSourceGf.radius
                                    )}
                                    options={{
                                        strokeColor: "#0088FF",
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                        fillColor: "#0088FF",
                                        fillOpacity: 0.2,
                                    }}
                                />
                            )}
                            {/* Destination Polygon */}
                            {selectedDestinationGf && (
                                <Polygon
                                    path={createCircle(
                                        { lat: selectedDestinationGf.lat, lng: selectedDestinationGf.lng },
                                        selectedDestinationGf.radius
                                    )}
                                    options={{
                                        strokeColor: "#FF0000",
                                        strokeOpacity: 1,
                                        strokeWeight: 2,
                                        fillColor: "#FF0000",
                                        fillOpacity: 0.2,
                                    }}
                                />
                            )}
                            {/* Optional: display polygons for each waypoint */}
                            {selectedWaypointsGf &&
                                selectedWaypointsGf.map((wp) => (
                                    <Polygon
                                        key={wp._id}
                                        path={createCircle({ lat: wp.lat, lng: wp.lng }, wp.radius)}
                                        options={{
                                            strokeColor: "#00AA00",
                                            strokeOpacity: 1,
                                            strokeWeight: 2,
                                            fillColor: "#00AA00",
                                            fillOpacity: 0.2,
                                        }}
                                    />
                                ))}
                        </GoogleMap>
                    </CardBody>
                </Card>
            </div>
            {/* Routes Table */}
            <div className="mt-6">
                <Typography variant="h5" className="mb-4">
                    Existing Routes
                </Typography>
                <div className="overflow-x-auto">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                            <tr className="bg-blue-gray-50">
                                <th className="p-3">Route Name</th>
                                <th className="p-3">Source</th>
                                <th className="p-3">Destination</th>
                                <th className="p-3">Scheduled At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {routes.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="p-3 text-center">
                                        No routes available
                                    </td>
                                </tr>
                            ) : (
                                routes.map((route, idx) => (
                                    <tr key={idx} className={idx % 2 === 1 ? "bg-blue-gray-50/50" : ""}>
                                        <td className="p-3">{route.name}</td>
                                        <td className="p-3">
                                            {route.source
                                                ? route.source.name
                                                : getGeofenceName(route.source)}
                                        </td>
                                        <td className="p-3">
                                            {route.destination
                                                ? route.destination.name
                                                : getGeofenceName(route.destination)}
                                        </td>
                                        <td className="p-3">
                                            {route.scheduledAt ? new Date(route.scheduledAt).toLocaleString() : "N/A"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
