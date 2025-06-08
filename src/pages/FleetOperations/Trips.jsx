// src/pages/Administration/Trips.jsx
import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";

export default function Trips() {
  // Static column headers and sample data
  const columns = [
    "Vehicle No",
    "Vendor",
    "Source",
    "Destination",
    "Total KM",
    "ETA",
    "Trip Status",
  ];
  const data = [
    ["GJ16Z5115", "Vendor A", "Location A", "Location B", "120 km", "Apr 15, 2025 10:00 AM", "Not Started"],
    ["MH12AB3456", "Vendor B", "Location C", "Location D", "200 km", "Apr 15, 2025 12:30 PM", "In Progress"],
    // add more rows as needed...
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4">Trips</Typography>
        <Button color="blue">
          Create Trip
        </Button>
      </div>
      <Card>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-blue-gray-50">
                  {columns.map((col) => (
                    <th key={col} className="p-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 1 ? "bg-blue-gray-50/50" : ""}>
                      {row.map((cell, cidx) => (
                        <td key={cidx} className="p-3">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="p-3 text-center">
                      No trips available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
