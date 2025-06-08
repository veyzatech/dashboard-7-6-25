// src/components/SimpleTable.jsx
import React from "react";
import { Typography, Button } from "@material-tailwind/react";

export default function SimpleTable({ title, columns, data, onAdd }) {
  return (
    <div className="">
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
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-3 text-center">
                  No rows
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className={idx % 2 === 1 ? "bg-blue-gray-50/50" : ""}
                >
                  {row.map((cell, cidx) => (
                    <td key={cidx} className="p-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
