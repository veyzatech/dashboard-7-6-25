import React, { useState, useEffect } from "react";
import { Button, Typography } from "@material-tailwind/react";
import ReactDOM from "react-dom";
import AddDriverModal from "../../components/AddDriverModal";

export default function DriverTab() {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showFlyout, setShowFlyout] = useState(false);
  const token = localStorage.getItem("authToken");

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
        setLoading(false);
      } catch (err) {
        console.error("Error fetching drivers:", err);
        setError(err.message);
        setLoading(false);
      }
    }
    fetchDrivers();
  }, [token]);

  const handleDriverAdded = (newDriver) => {
    setDrivers((prev) => [...prev, newDriver]);
  };

  const handleRowClick = (driver) => {
    setSelectedDriver(driver);
    setShowFlyout(true);
  };

  const closeFlyout = () => {
    setShowFlyout(false);
    // Optionally clear selected driver:
    // setSelectedDriver(null);
  };

  const renderTable = () => {
    if (drivers.length === 0) {
      return <p className="text-gray-500 p-4">No drivers available</p>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead>
            <tr className="bg-blue-gray-50">
              <th className="p-3">Name</th>
              <th className="p-3">Mobile</th>
              <th className="p-3">Aadhaar</th>
              <th className="p-3">DL Number</th>
              <th className="p-3">DL Expiry</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver, idx) => (
              <tr
                key={driver._id}
                className={`cursor-pointer ${idx % 2 === 1 ? "bg-blue-gray-50/50" : "bg-white"}`}
                onClick={() => handleRowClick(driver)}
              >
                <td className="p-3">{driver.driverName || "N/A"}</td>
                <td className="p-3">{driver.mobile || "N/A"}</td>
                <td className="p-3">{driver.aadhar || "N/A"}</td>
                <td className="p-3">{driver.dlNumber || "N/A"}</td>
                <td className="p-3">
                  {driver.dlExpiryDate ? new Date(driver.dlExpiryDate).toLocaleDateString() : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) {
    return <div className="p-4">Loading drivers...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 relative">
      <div className="flex justify-between items-center mb-4">
        <Typography variant="h4" className="mb-4">
          Drivers
        </Typography>
        <Button onClick={() => setShowModal(true)} color="blue" className="mb-4">
          Add Driver
        </Button>
      </div>

      {renderTable()}

      <AddDriverModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        onDriverAdded={handleDriverAdded}
      />

      {selectedDriver &&
        ReactDOM.createPortal(
          <div
            className={`fixed top-0 right-0 h-screen w-full md:w-2/5 bg-white shadow-2xl p-4 overflow-y-auto z-[9999] transform transition-transform duration-300 ${
              showFlyout ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <Typography variant="h5" className="font-bold">
                {selectedDriver.driverName || "Driver Details"}
              </Typography>
              <Button color="red" onClick={closeFlyout} className="h-10">
                Close
              </Button>
            </div>
            <div className="space-y-3 text-sm text-blue-gray-800">
              <div>
                <span className="font-medium">Mobile: </span>
                <span>{selectedDriver.mobile || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Aadhaar: </span>
                <span>{selectedDriver.aadhar || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">DL Number: </span>
                <span>{selectedDriver.dlNumber || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">DL Expiry Date: </span>
                <span>
                  {selectedDriver.dlExpiryDate
                    ? new Date(selectedDriver.dlExpiryDate).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div>
                <span className="font-medium">Base Salary: </span>
                <span>{selectedDriver.base_salary || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Variable Pay: </span>
                <span>{selectedDriver.variablePay || "N/A"}</span>
              </div>
              <div>
                <span className="font-medium">Bank Details: </span>
                {selectedDriver.bank_details ? (
                  <div className="pl-4">
                    <p>
                      <span className="font-medium">Account No:</span>{" "}
                      {selectedDriver.bank_details.account_no || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">IFSC:</span>{" "}
                      {selectedDriver.bank_details.ifsc_code || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Bank Name:</span>{" "}
                      {selectedDriver.bank_details.bank_name || "N/A"}
                    </p>
                  </div>
                ) : (
                  <span>N/A</span>
                )}
              </div>
              <div>
                <span className="font-medium">Documents: </span>
                {selectedDriver.documents && selectedDriver.documents.length > 0 ? (
                  <ul className="list-disc list-inside pl-4 mt-1">
                    {selectedDriver.documents.map((doc) => (
                      <li key={doc._id}>
                        {doc.docType} –{" "}
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          View
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span>No Documents</span>
                )}
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")
        )}
    </div>
  );
}
