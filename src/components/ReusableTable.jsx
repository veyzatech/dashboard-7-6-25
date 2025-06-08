import React from "react";

/**
 * @param {string[]} headers - An array of header labels.
 * @param {object[]} data - An array of objects representing each row.
 * @param {string[]} dataKeys - (Optional) If you want to map each header to a specific key in the data.
 * @param {boolean} [striped] - Whether to use striped rows (default: true).
 * @param {string} [className] - Additional Tailwind classes for the table container.
 */
export default function ReusableTable({
  headers = [],
  data = [],
  dataKeys = [],
  striped = true,
  className = "",
}) {
  return (
    <div className={`overflow-x-auto mb-4 ${className}`}>
      <table className="w-full min-w-max table-auto text-left border-collapse">
        <thead>
          <tr className="bg-blue-gray-50">
            {headers.map((head, idx) => (
              <th
                key={idx}
                className="p-3 text-sm font-bold uppercase text-blue-gray-600"
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={headers.length}
                className="p-3 text-center text-blue-gray-500"
              >
                No data
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => {
              // Determine row background if striped
              const rowBg = striped && rowIndex % 2 === 1 ? "bg-blue-gray-50/50" : "";
              return (
                <tr key={rowIndex} className={rowBg}>
                  {headers.map((head, colIndex) => {
                    // If dataKeys is provided, use that to find the value
                    // else we assume the header text matches the object key
                    const key =
                      dataKeys.length > 0 ? dataKeys[colIndex] : head;
                    return (
                      <td key={colIndex} className="p-3">
                        {row[key] ?? ""}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
