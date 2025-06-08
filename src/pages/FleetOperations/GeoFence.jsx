import React, { Fragment, useEffect, useState, useRef } from "react";
import {
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { GoogleMap, Polygon, InfoWindow } from "@react-google-maps/api";

// ----- CONFIGURATION -----
const containerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

// ----- HELPER FUNCTION -----
// Create a circular polygon (an array of {lat, lng}) for the given center and radius (in km).
// Expects center as an object: { lat, lng }.
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
    // Fallback approximate conversion
    const earthRadius = 6371; // km
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const angle = (i * 360) / numPoints;
      const radians = (Math.PI / 180) * angle;
      const dx = (radiusInKm / earthRadius) * Math.cos(radians);
      const dy = (radiusInKm / earthRadius) * Math.sin(radians);
      const newLat = center.lat + (dy * 180) / Math.PI;
      const newLng =
        center.lng +
        (dx * 180) / (Math.PI * Math.cos((center.lat * Math.PI) / 180));
      points.push({ lat: newLat, lng: newLng });
    }
    return points;
  }
};

export default function GeofenceScreenGoogleMaps() {
  const [geofencesData, setGeofencesData] = useState([]);
  // const [searchTerm, setSearchTerm] = useState("");
  const [selectedInfo, setSelectedInfo] = useState(null);

  // Modal state for "Create New Geofence"
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [newGeofenceName, setNewGeofenceName] = useState("");
  const [newGeofenceLatitude, setNewGeofenceLatitude] = useState("");
  const [newGeofenceLongitude, setNewGeofenceLongitude] = useState("");
  const [newGeofenceRadius, setNewGeofenceRadius] = useState("");

  // Ref for the hidden Bulk Upload input
  const bulkUploadRef = useRef(null);

  // Reference to the map so we can pan/zoom programmatically.
  const [mapRef, setMapRef] = useState(null);

  // ----- FETCH GEOFENCES -----
  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(
          `https://api.veyza.in/veyza-api/v0/geofences`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const geofences = await response.json();
        if (Array.isArray(geofences)) {
          const formatted = geofences.map((gf) => ({
            _id: gf._id,
            name: gf.name,
            lat: Number(gf.lat),
            lng: Number(gf.long), // Assumes backend returns "long"
            radius: Number(gf.radius),
            distance_unit: gf.distance_unit,
          }));
          setGeofencesData(formatted);
        } else {
          console.error("API response is not an array:", geofences);
        }
      } catch (error) {
        console.error("Failed to fetch geofences:", error);
      }
    };
    fetchGeofences();
  }, []);

  // ----- CREATE NEW GEOFENCE HANDLER -----
  const handleCreateGeofence = async () => {
    if (
      !newGeofenceName ||
      !newGeofenceLatitude ||
      !newGeofenceLongitude ||
      !newGeofenceRadius
    ) {
      alert("Please provide valid geofence details.");
      return;
    }

    const newGf = {
      lat: newGeofenceLatitude.toString(),
      long: newGeofenceLongitude.toString(),
      radius: newGeofenceRadius.toString(),
      name: newGeofenceName,
    };

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/v0/create-geofence`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify(newGf),
        }
      );
      if (!response.ok) throw new Error("Failed to create geofence");
      const createdGf = await response.json();
      setGeofencesData((prev) => [
        ...prev,
        {
          _id: createdGf._id,
          name: createdGf.name,
          lat: Number(createdGf.lat),
          lng: Number(createdGf.long),
          radius: Number(createdGf.radius),
          distance_unit: createdGf.distance_unit,
        },
      ]);
      setNewGeofenceName("");
      setNewGeofenceLatitude("");
      setNewGeofenceLongitude("");
      setNewGeofenceRadius("");
      setOpenCreateModal(false);
    } catch (error) {
      console.error("Error creating geofence:", error);
      alert("Error creating geofence");
    }
  };

  // ----- BULK UPLOAD HANDLER -----
  const handleBulkUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!Array.isArray(data)) {
          alert("Invalid file format. Expected an array of geofences.");
          return;
        }
        const token = localStorage.getItem("authToken");
        for (const gf of data) {
          const response = await fetch(
            `${import.meta.env.VITE_SERVER_URL}/v0/geofences`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              credentials: "include",
              body: JSON.stringify(gf),
            }
          );
          if (!response.ok) {
            console.error("Failed to upload geofence:", gf);
          } else {
            const createdGf = await response.json();
            setGeofencesData((prev) => [
              ...prev,
              {
                _id: createdGf._id,
                name: createdGf.name,
                lat: Number(createdGf.lat),
                lng: Number(createdGf.long),
                radius: Number(createdGf.radius),
                distance_unit: createdGf.distance_unit,
              },
            ]);
          }
        }
      } catch (err) {
        console.error("Error processing bulk upload file:", err);
      }
    };
    reader.readAsText(file);
  };

  // ----- PAN & ZOOM ON CARD CLICK -----
  const handleCardClick = (gf) => {
    if (mapRef) {
      mapRef.panTo({ lat: gf.lat, lng: gf.lng });
      mapRef.setZoom(12); // adjust zoom level as desired
    }
  };

  // ----- FILTER GEOfENCES BASED ON SEARCH -----
  const [searchTerm, setSearchTerm] = useState("");
  const filteredGeofences = geofencesData.filter((gf) =>
    gf.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Fragment>
      {/* Main container: Left (list/controls) and Right (map) columns */}
      <div className="flex h-screen w-full overflow-hidden">
        {/* Left column: Geofence list & controls */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r p-4 overflow-y-auto">
          <div className="flex flex-col gap-2 mb-4">
            <Input
              type="text"
              placeholder="Search for Geofences"
              className="w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-2">
              <Button color="blue" onClick={() => bulkUploadRef.current.click()}>
                Bulk Upload
              </Button>
              <Button color="green" onClick={() => setOpenCreateModal(true)}>
                Create new Geofence
              </Button>
              <input
                type="file"
                ref={bulkUploadRef}
                style={{ display: "none" }}
                accept=".json"
                onChange={handleBulkUpload}
              />
            </div>
          </div>
          {filteredGeofences.length === 0 ? (
            <p className="text-gray-500">No Geofences present</p>
          ) : (
            <div className="space-y-2">
              {filteredGeofences.map((gf) => (
                <div
                  key={gf._id}
                  className="border rounded p-2 shadow-sm hover:bg-gray-50 cursor-pointer"
                  onClick={() => handleCardClick(gf)}
                >
                  <p className="font-semibold">{gf.name}</p>
                  <p className="text-sm text-gray-600">
                    Lat: {gf.lat}, Lng: {gf.lng}
                  </p>
                  <p className="text-sm text-gray-600">
                    Radius: {gf.radius} {gf.distance_unit || "km"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column: Map */}
        <div className="flex-1 relative">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={6}
            onLoad={(map) => setMapRef(map)}
          >
            {/* Render a Polygon for each geofence */}
            {geofencesData.map((gf) => {
              const displayScaleFactor = 3; // adjust as desired
              const radiusInKm =
                gf.distance_unit === "m" ? gf.radius / 1000 : gf.radius;
              const displayRadiusInKm = radiusInKm * displayScaleFactor;
              const path = createCircle({ lat: gf.lat, lng: gf.lng }, displayRadiusInKm);
              return (
                <Polygon
                  key={gf._id}
                  path={path}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 3,
                    fillColor: "#FF0000",
                    fillOpacity: 0.2,
                  }}
                  onMouseOver={(e) =>
                    setSelectedInfo({
                      ...gf,
                      position: e.latLng.toJSON(),
                    })
                  }
                  onMouseOut={() => setSelectedInfo(null)}
                  onClick={(e) =>
                    setSelectedInfo({
                      ...gf,
                      position: e.latLng.toJSON(),
                    })
                  }
                />
              );
            })}
            {selectedInfo && (
              <InfoWindow
                position={selectedInfo.position}
                onCloseClick={() => setSelectedInfo(null)}
              >
                <div>
                  <h3>{selectedInfo.name}</h3>
                  <p>Lat: {selectedInfo.lat}, Lng: {selectedInfo.lng}</p>
                  <p>
                    Radius: {selectedInfo.radius}{" "}
                    {selectedInfo.distance_unit || "km"}
                  </p>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </div>
      </div>

      {/* Create New Geofence Modal */}
      <Dialog open={openCreateModal} handler={setOpenCreateModal}>
        <DialogHeader>Create New Geofence</DialogHeader>
        <DialogBody divider>
          <div className="flex flex-col gap-4">
            <Input
              label="Geofence Name"
              value={newGeofenceName}
              onChange={(e) => setNewGeofenceName(e.target.value)}
            />
            <Input
              label="Latitude"
              value={newGeofenceLatitude}
              onChange={(e) => setNewGeofenceLatitude(e.target.value)}
            />
            <Input
              label="Longitude"
              value={newGeofenceLongitude}
              onChange={(e) => setNewGeofenceLongitude(e.target.value)}
            />
            <Input
              label="Radius"
              value={newGeofenceRadius}
              onChange={(e) => setNewGeofenceRadius(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color="green" onClick={handleCreateGeofence}>
            Create
          </Button>
          <Button color="red" onClick={() => setOpenCreateModal(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </Fragment>
  );
}
