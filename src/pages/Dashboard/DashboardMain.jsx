// src/pages/DashboardMain.jsx
import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import KpiCard from "./KpiCard";
import MapView from "./MapView";

export default function DashboardMain() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vehicle data from the get-live-location API
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/get-live-location", {
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch vehicle data");
        }
        const data = await response.json();
        setVehicles(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchVehicles();
  }, []);

  // Filter vehicles by search term
  const filteredVehicles = vehicles.filter((veh) =>
    veh.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log("Filtered Vehicles:", filteredVehicles);

  // Compute status counts based on the status field.
  const allCount = vehicles.length;
  const runningCount = vehicles.filter(
    (veh) => veh.status.trim().toLowerCase() === "running"
  ).length;
  const stoppedCount = vehicles.filter(
    (veh) => veh.status.trim().toLowerCase() === "parked"
  ).length;
  const idleCount = vehicles.filter(
    (veh) => veh.status.trim().toLowerCase() === "idle"
  ).length;
  const disconnectedCount = vehicles.filter(
    (veh) => veh.status.toLowerCase().includes("no data since")
  ).length;

  return (
    <div className="flex flex-col h-screen">
      {/* TOP: KPI Indicators */}
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <KpiCard
            title="All Vehicles"
            value={allCount.toString()}
            percentage={0}
            comparisonLabel=""
          />
          <KpiCard
            title="Running"
            value={runningCount.toString()}
            percentage={0}
            comparisonLabel=""
          />
          <KpiCard
            title="Stopped"
            value={stoppedCount.toString()}
            percentage={0}
            comparisonLabel=""
          />
          <KpiCard
            title="Idle"
            value={idleCount.toString()}
            percentage={0}
            comparisonLabel=""
          />
          <KpiCard
            title="Disconnected"
            value={disconnectedCount.toString()}
            percentage={0}
            comparisonLabel=""
          />
        </div>
      </div>

      {/* BOTTOM: Two-column layout (Left: Vehicles list, Right: Map) */}
      <div className="flex flex-1">
        {/* LEFT COLUMN: List */}
        <div className="w-full md:w-1/4 border-r p-4 overflow-y-auto bg-white">
          {/* Search Bar */}
          <div className="mb-4">
            <Input
              label="Search Vehicles"
              icon={<MagnifyingGlassIcon className="w-5 h-5 text-blue-gray-500" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Typography variant="h6" className="mb-2">
            Vehicles
          </Typography>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="red">{error}</Typography>
          ) : filteredVehicles.length === 0 ? (
            <Typography>No Vehicles</Typography>
          ) : (
            <div className="space-y-2">
              {filteredVehicles.map((veh) => (
                <Card key={veh._id} className="shadow-sm hover:shadow-md cursor-pointer">
                  <CardBody className="p-3">
                    <Typography className="font-semibold">
                      {veh.vehicleNumber}
                    </Typography>
                    <Typography variant="small" className="text-gray-600">
                      {veh.status || "Unknown status"}
                    </Typography>
                    <Typography variant="small" className="text-gray-500">
                      {veh.location || "No location data"}
                    </Typography>
                    <Typography variant="small" className="text-gray-400">
                      Last Updated:{" "}
                      {new Date(veh.lastPacketReceivedAt).toLocaleString()}
                    </Typography>
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Map */}
        <div className="flex-1 relative">
          <MapView />
        </div>
      </div>
    </div>
  );
}
