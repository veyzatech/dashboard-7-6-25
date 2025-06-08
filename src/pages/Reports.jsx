// src/pages/Administration/TripReport.jsx
import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import SimpleTable from "../components/SimpleTable";

export default function TripReport() {
  const navigate = useNavigate();

  // The display headers you requested
  const columns = [
    "SR.",
    "Loading Date",
    "Vehicle No.",
    "Vehicle Type",
    "Veh. Capacity",
    "Vendor Name",
    "Driver Name",
    "Driver Contact No",
    "Last Arrival Location",
    "Trip Number",
    "Route/Lane",
    "Schedule Transit Hours",
    "From",
    "Via 1",
    "Via 2",
    "Via 3",
    "Via 4",
    "To",
    "Status As On Day Before",
    "Actual Transit Hours",
    "POD Upload Status",
    "Remarks",
  ];

  // One sample row; add more rows as needed
  const data = [
    [
      "1",
      "14.04.2025",
      "765",
      "Tempo",
      "7.000",
      "Karma",
      "Mayur",
      "9374094456",
      "BRD",
      "BRD-ANK-SRT-VPI-BWD",
      "20",
      "BRD",
      "ANK",
      "SRT",
      "VPI",
      "",
      "BWD",
      "ON WAY",
      "22",
      "YES",
      "",
    ],
  ];

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Trip Detail Report
      </Typography>
      <Card className="rounded-xl shadow-sm">
        <CardBody>
          <SimpleTable title="Trip Detail Report" columns={columns} data={data} />
          <div className="mt-4">
            <Button color="blue" onClick={() => navigate("/reports")}>
              Back to Reports Dashboard
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
