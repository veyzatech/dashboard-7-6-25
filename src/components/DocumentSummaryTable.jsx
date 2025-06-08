// src/components/DocumentSummaryTable.jsx
import React from "react";
import { Typography } from "@material-tailwind/react";

export default function DocumentSummaryTable() {
  return (
    <div className="mt-4">
      <Typography variant="h6" className="mb-2">
        Document Summary
      </Typography>
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="bg-blue-gray-50">
              <th className="p-3">TRUCK REG NO</th>
              <th className="p-3">FITNESS BUCKET</th>
              <th className="p-3">INSURANCE BUCKET</th>
              <th className="p-3">STATE PERMIT BUCKET</th>
              <th className="p-3">TAX CERTIFICATE BUCKET</th>
              <th className="p-3">VALIDITY OF INSURANCE</th>
            </tr>
          </thead>
          <tbody>
            <tr className="even:bg-blue-gray-50/50">
              <td className="p-3">MH12AB3456</td>
              <td className="p-3">80-90 days</td>
              <td className="p-3">60-70 days</td>
              <td className="p-3">120 days</td>
              <td className="p-3">90 days</td>
              <td className="p-3">2025-08-12</td>
            </tr>
            {/* ... more rows */}
          </tbody>
        </table>
      </div>
    </div>
  );
}
