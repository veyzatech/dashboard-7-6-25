// src/pages/Administration.jsx
import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import RandomPieChart from "../components/RandomPieChart";
import DocumentSummaryTable from "../components/DocumentSummaryTable";
import VehicleTab from "./Adminstration/VehicleTab";
import SimpleTable from "../components/SimpleTable";
import DriverTab from "./Adminstration/DriverTab";
import DocumentTab from "./Adminstration/Documents";

export default function Administration() {
  const [activeTab, setActiveTab] = useState("vehicle");
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch vehicle data from the live-location API
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

  // Filter vehicles by searchTerm
  const filteredVehicles = vehicles.filter((veh) =>
    veh.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Example data for vehicle documen

  return (
    <div className="">
      <Typography variant="h4" className="mb-4">
        Administration
      </Typography>
      <Card className="rounded-xl shadow-sm">
        <CardBody>
          <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
            <TabsHeader>
              <Tab value="vehicle">Vehicle</Tab>
              {/* <Tab value="user">User</Tab> */}
              <Tab value="driver">Driver</Tab>
              <Tab value="vehicle-document">Vehicle Document</Tab>
            </TabsHeader>
            <TabsBody>
              {/* Vehicle Tab */}
              <TabPanel value="vehicle">
                <VehicleTab/>
              </TabPanel>

              {/* User Tab */}
              {/* <TabPanel value="user">
                <SimpleTable
                  title="Users"
                  columns={userColumns}
                  data={userData}
                  onAdd={() => alert("Add User clicked")}
                />
              </TabPanel> */}

              {/* Driver Tab */}
              <TabPanel value="driver">
                <DriverTab/>
              </TabPanel>

              {/* Vehicle Document Tab */}
              <TabPanel value="vehicle-document">
                <DocumentTab/>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
