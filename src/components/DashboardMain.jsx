// src/pages/DashboardMain.jsx
import React, { useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Typography,
  Chip,
} from "@material-tailwind/react";
import {
  MagnifyingGlassIcon,
  MapIcon,
} from "@heroicons/react/24/outline";
import KpiCard from "./KpiCard";

// Define table header and row data
const tableHeadData = [
  "Vehicle Number",
  "Status",
  "Last Location",
  "Last Updated",
];
const tableRowData = [
  {
    vehicleNumber: "GJ19Y9782",
    status: "Stopped since 06:48 PM",
    lastLocation: "CHH",
    lastUpdated: "2025-03-15 13:50",
  },
  {
    vehicleNumber: "GJ19Y8683",
    status: "Stopped since 10:50 AM",
    lastLocation: "CBR",
    lastUpdated: "2025-03-15 12:30",
  },
  {
    vehicleNumber: "GJ19Y7863",
    status: "PARKED",
    lastLocation:
      "Road Number C-1 Industrial Estate, Udhna Udhyog Nagar, Udhna, Surat, GJ",
    lastUpdated: "2025-03-15 13:20",
  },
  {
    vehicleNumber: "MH38AY7838",
    status: "PARKED",
    lastLocation: "Kadodara Surat, Gujarat, India 394327",
    lastUpdated: "2025-03-15 13:30",
  },
  {
    vehicleNumber: "GJ12BS1515",
    status: "PARKED",
    lastLocation:
      "Vraj Estate Road, Bhavan, Gujarat, India, 389001",
    lastUpdated: "2025-03-15 13:45",
  },
];

export default function DashboardMain() {
  // State to toggle between Dashboard and Map view
  const [isMapView, setIsMapView] = useState(false);

  // If in Map view, show a placeholder (replace with your Map component)
  if (isMapView) {
    return (
      <div className="flex items-center justify-center">
        <Typography variant="h4" color="blue-gray">
          Map View
        </Typography>
        <Button
          color="blue"
          className="ml-4 flex items-center gap-2"
          onClick={() => setIsMapView(false)}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Top Section: Search and Map View Button */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-4">
        {/* Search Input */}
        <div className="w-full md:max-w-sm">
          <Input
            label="Search Vehicle Number"
            icon={
              <MagnifyingGlassIcon className="w-5 h-5 text-blue-gray-500" />
            }
          />
        </div>
        {/* Map View Button */}
        <Button
          color="blue"
          className="flex items-center gap-2"
          onClick={() => setIsMapView(true)}
        >
          <MapIcon className="w-5 h-5" />
          Map View
        </Button>
      </div>

      {/* KPI Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <KpiCard
          title="All Vehicles"
          value="153"
          percentage={5}
          comparisonLabel="last month: 145"
        />
        <KpiCard
          title="Running"
          value="85"
          percentage={3}
          comparisonLabel="last month: 82"
        />
        <KpiCard
          title="Stopped"
          value="50"
          percentage={-2}
          comparisonLabel="last month: 51"
        />
        <KpiCard
          title="Idle"
          value="18"
          percentage={-2}
          comparisonLabel="last month: 51"
        />
        <KpiCard
          title="Disconnected"
          value="9"
          percentage={-1}
          comparisonLabel="last month: 19"
        />
      </div>

      {/* Vehicle Data Table */}
      <Card>
        <CardBody className="overflow-x-auto">
          <table className="w-full min-w-max table-auto text-left">
            <thead>
              <tr>
                {tableHeadData.map((head, index) => (
                  <th
                    key={index}
                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-bold uppercase text-blue-gray-600"
                    >
                      {head}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRowData.map((row, rowIndex) => (
                <tr key={rowIndex} className="even:bg-blue-gray-50/50">
                  <td className="p-4">{row.vehicleNumber}</td>
                  <td className="p-4">{row.status}</td>
                  <td className="p-4">{row.lastLocation}</td>
                  <td className="p-4">{row.lastUpdated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  );
}
