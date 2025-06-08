import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
} from "@material-tailwind/react";

export default function VehicleTab() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get token from localStorage. Ensure that this key is set.
  const token = localStorage.getItem("authToken");

  // Debug: log token value to console (remove in production)
  console.log("Authorization Token:", token);

  // Fetch vehicle data from the external API.
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/vehicles", {
          headers: {
            "Content-Type": "application/json",
            // Uncomment the following line if the API requires a Bearer token
            "Authorization": token ? `Bearer ${token}` : "",
          },
          // You may remove credentials: "include" if the external API does not require it.
          credentials: "include",
        });
        console.log(response)

        if (!response.ok) {
          // Log full response for debugging:
          console.error("Response status:", response.status, await response.text());
          throw new Error("Failed to fetch vehicle data");
        }
        const data = await response.json();
        console.log("Fetched vehicle data:", data); // Debug: log fetched data
        // Assuming the API returns an array; adjust if necessary.
        setVehicles(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchVehicles();
  }, [token]);

  // Filter vehicles by search term.
  const filteredVehicles = vehicles.filter((veh) =>
    veh.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Vehicles Table */}
      <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Vehicles</Typography>
            <div className="flex items-center gap-4">
              <Input
                type="text"
                placeholder="Search by vehicle number"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button color="blue">EXPORT</Button>
            </div>
          </div>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : error ? (
            <Typography color="red">{error}</Typography>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr className="bg-blue-gray-50">
                    <th className="p-3">Vehicle Number</th>
                    <th className="p-3">Created Date</th>
                    <th className="p-3">Expiry date</th>
                    <th className="p-3">Device ID</th>
                    <th className="p-3">SIM Number</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map((veh, index) => (
                    <tr className="even:bg-blue-gray-50/50" key={index}>
                      <td className="p-3">{veh.vehicleNumber || "N/A"}</td>
                      <td className="p-3">{veh.registrationDate || "N/A"}</td>
                      <td className="p-3">{"02/12/2028"}</td>
                      <td className="p-3">{veh.device || "N/A"}</td>
                      <td className="p-3">{veh.deviceID || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Groups Table */}
      {/* <Card>
        <CardBody>
          <div className="flex justify-between items-center mb-4">
            <Typography variant="h6">Groups</Typography>
            <Button color="blue">EXPORT</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-blue-gray-50">
                  <th className="p-3">Group Name</th>
                  <th className="p-3">Assigned Vehicles</th>
                  <th className="p-3">Created Date</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr className="even:bg-blue-gray-50/50">
                  <td className="p-3">Group A</td>
                  <td className="p-3">V123, V125</td>
                  <td className="p-3">2025-03-15</td>
                  <td className="p-3">
                    <Button size="sm" variant="text">
                      Add/Remove
                    </Button>
                  </td>
                </tr>
                <tr className="even:bg-blue-gray-50/50">
                  <td className="p-3">Group B</td>
                  <td className="p-3">V127</td>
                  <td className="p-3">2025-03-16</td>
                  <td className="p-3">
                    <Button size="sm" variant="text">
                      Add/Remove
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card> */}
    </div>
  );
}
