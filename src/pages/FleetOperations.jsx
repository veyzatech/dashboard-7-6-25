import React, { useState } from "react";
import {
  Card,
  CardBody,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Typography,
  Input,
  Button
} from "@material-tailwind/react";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import RouteOptimization from "./FleetOperations/RouteOptimization";
import GeofenceScreenGoogleMaps from "./FleetOperations/GeoFence";
import Trips from "./FleetOperations/Trips";

export default function FleetOperations() {
  const [activeTab, setActiveTab] = useState("geofences");

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">
        Fleet Operations
      </Typography>
      <Card className="rounded-xl shadow-sm">
        <CardBody>
          <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
            {/* Tab Buttons */}
            <TabsHeader>
              <Tab value="geofences">Geofences</Tab>
              <Tab value="route-optimization">Route Optimization</Tab>
              <Tab value="trips">Trips</Tab>
              <Tab value="fuel">Fuel</Tab>
              <Tab value="toll">Toll Tax</Tab>
            </TabsHeader>
            {/* Tab Content */}
            <TabsBody>
              {/* Geofences Tab */}
              <TabPanel value="geofences">
                <GeofenceScreenGoogleMaps />
              </TabPanel>
              {/* Route Optimization Tab */}
              <TabPanel value="route-optimization">
                <RouteOptimization />
              </TabPanel>
              {/* Trips Tab */}
              <TabPanel value="trips">
                <Trips />
              </TabPanel>
              <TabPanel value="fuel">
              <Typography variant="h5" className="mb-4">
                    Fuel Management
                  </Typography>
                <div className="flex h-60 w-full flex-col items-center justify-center">
                  <Typography variant="h5" className="mb-4">
                    Coming soon
                  </Typography>
                </div>
              </TabPanel>
              <TabPanel value="toll">
              <Typography variant="h5" className="mb-4">
                    Toll Tax Management
                  </Typography>
                <div className="flex h-60 w-full flex-col items-center justify-center">
                  <Typography variant="h5" className="mb-4">
                    Coming soon
                  </Typography>
                </div>
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  );
}
