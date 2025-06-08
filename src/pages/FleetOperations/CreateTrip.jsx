import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

export default function CreateTripModal({ open, handleClose, onTripCreated }) {
  const token = localStorage.getItem("authToken");

  // Form state for creating a trip
  const [newTrip, setNewTrip] = useState({
    vehicleId: "",
    vehicleNumber: "",
    driverId: "",
    driverName: "",
    routeId: "",
    expected_distance: "",
    documentType: "",
    documentFile: null,
  });

  // Data lists for dropdowns
  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);

  // Loading/Error states for each dropdown
  const [loadingVehicles, setLoadingVehicles] = useState(true);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [vehicleError, setVehicleError] = useState("");
  const [driverError, setDriverError] = useState("");
  const [routeError, setRouteError] = useState("");

  // Fetch vehicles
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/vehicles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(Array.isArray(data) ? data : data.data || []);
        setLoadingVehicles(false);
      } catch (err) {
        setVehicleError(err.message);
        setLoadingVehicles(false);
      }
    }
    fetchVehicles();
  }, [token]);

  // Fetch drivers
  useEffect(() => {
    async function fetchDrivers() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/drivers", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch drivers");
        const data = await response.json();
        setDrivers(Array.isArray(data) ? data : data.data || []);
        setLoadingDrivers(false);
      } catch (err) {
        setDriverError(err.message);
        setLoadingDrivers(false);
      }
    }
    fetchDrivers();
  }, [token]);

  // Fetch routes
  useEffect(() => {
    async function fetchRoutes() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/routes", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch routes");
        const data = await response.json();
        setRoutes(Array.isArray(data) ? data : data.data || []);
        setLoadingRoutes(false);
      } catch (err) {
        setRouteError(err.message);
        setLoadingRoutes(false);
      }
    }
    fetchRoutes();
  }, [token]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documentFile") {
      setNewTrip((prev) => ({ ...prev, documentFile: files[0] }));
    } else {
      setNewTrip((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit trip
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simulate file upload and get a dummy URL if file selected.
    let documentUrl = "";
    if (newTrip.documentFile) {
      // Replace with real file upload logic if needed
      documentUrl = "http://example.com/uploaded-document.pdf";
    }

    const payload = {
      vehicle: {
        id: newTrip.vehicleId,
        number: newTrip.vehicleNumber,
      },
      driver: {
        id: newTrip.driverId,
        name: newTrip.driverName,
      },
      route: newTrip.routeId,
      expected_distance: Number(newTrip.expected_distance),
      documents:
        newTrip.documentType && documentUrl
          ? [{ docType: newTrip.documentType, fileUrl: documentUrl }]
          : [],
    };

    try {
      const response = await fetch("https://api.veyza.in/veyza-api/v0/create-trip", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to create trip");

      const result = await response.json();
      console.log("Trip created successfully:", result);
      alert("Trip created successfully!");
      if (onTripCreated) onTripCreated(result.trip || result);
      setNewTrip({
        vehicleId: "",
        vehicleNumber: "",
        driverId: "",
        driverName: "",
        routeId: "",
        expected_distance: "",
        documentType: "",
        documentFile: null,
      });
      handleClose();
    } catch (error) {
      console.error("Error creating trip:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <Dialog open={open} handler={handleClose} size="lg">
      <DialogHeader>
        <Typography variant="h5" className="font-bold">
          Create a New Trip
        </Typography>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        {/* Use a two-column layout on larger screens */}
        <DialogBody divider className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Vehicle Selection */}
          <Select
            label="Select Vehicle"
            name="vehicleId"
            value={newTrip.vehicleId}
            onChange={(value) => {
              const selectedVehicle = vehicles.find((v) => v._id === value);
              setNewTrip((prev) => ({
                ...prev,
                vehicleId: value,
                vehicleNumber: selectedVehicle ? selectedVehicle.vehicleNumber : "",
              }));
            }}
            required
          >
            {loadingVehicles ? (
              <Option>Loading...</Option>
            ) : vehicleError ? (
              <Option>Error</Option>
            ) : (
              vehicles.map((vehicle) => (
                <Option key={vehicle._id} value={vehicle._id}>
                  {vehicle.vehicleNumber || "Unnamed Vehicle"}
                </Option>
              ))
            )}
          </Select>

          {/* Driver Selection */}
          <Select
            label="Select Driver"
            name="driverId"
            value={newTrip.driverId}
            onChange={(value) => {
              const selectedDriver = drivers.find((d) => d._id === value);
              setNewTrip((prev) => ({
                ...prev,
                driverId: value,
                driverName: selectedDriver ? selectedDriver.driverName : "",
              }));
            }}
            required
          >
            {loadingDrivers ? (
              <Option>Loading...</Option>
            ) : driverError ? (
              <Option>Error</Option>
            ) : (
              drivers.map((driver) => (
                <Option key={driver._id} value={driver._id}>
                  {driver.driverName || "Unnamed Driver"}
                </Option>
              ))
            )}
          </Select>

          {/* Route Selection */}
          <Select
            label="Select Route"
            name="routeId"
            value={newTrip.routeId}
            onChange={(value) => setNewTrip((prev) => ({ ...prev, routeId: value }))}
            required
          >
            {loadingRoutes ? (
              <Option>Loading...</Option>
            ) : routeError ? (
              <Option>Error</Option>
            ) : (
              routes.map((route) => (
                <Option key={route._id} value={route._id}>
                  {route.name || "Unnamed Route"}
                </Option>
              ))
            )}
          </Select>

          {/* Expected Distance */}
          <Input
            type="number"
            name="expected_distance"
            label="Expected Distance (km)"
            placeholder="Enter expected distance"
            value={newTrip.expected_distance}
            onChange={handleInputChange}
            required
          />

          {/* Document Section */}
          <Select
            label="Document Type"
            name="documentType"
            value={newTrip.documentType}
            onChange={(value) => setNewTrip((prev) => ({ ...prev, documentType: value }))}
            required
          >
            <Option value="TripOrder">TripOrder</Option>
            <Option value="TripConfirmation">Trip Confirmation</Option>
            <Option value="Fitness">Fitness</Option>
            <Option value="PUC">PUC</Option>
          </Select>

          <Input
            type="file"
            name="documentFile"
            label="Upload Document"
            onChange={handleInputChange}
            className="file:rounded-lg file:border-0 file:bg-blue-gray-50 
                       file:py-2 file:px-4 file:text-sm file:font-semibold 
                       file:text-blue-gray-700 hover:file:bg-blue-gray-100 
                       focus:file:outline-none focus:file:ring-1 focus:file:ring-blue-500"
          />
        </DialogBody>
        <DialogFooter className="flex justify-end gap-4">
          <Button variant="outlined" color="red" onClick={handleClose}>
            Cancel
          </Button>
          <Button color="green" type="submit" className="w-full sm:w-auto">
            Submit
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
