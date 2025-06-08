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
} from "@material-tailwind/react";
import RandomPieChart from "../components/RandomPieChart";

// Example placeholder for a pie chart (replace with your actual chart)
function PlaceholderChart() {
    return (
        <div className="bg-gray-100 rounded-md h-64 flex items-center justify-center">
            <Typography variant="h6">Pie Chart Here</Typography>
        </div>
    );
}

// Example placeholder table
function PlaceholderTable({ title }) {
    return (
        <div className="mt-4">
            <Typography variant="h6" className="mb-2">
                {title}
            </Typography>
            <div className="overflow-x-auto">
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr className="bg-blue-gray-50">
                            <th className="p-3">VEHICLE NO.</th>
                            <th className="p-3">DRIVER NAME</th>
                            <th className="p-3">DETAIL</th>
                            <th className="p-3">DATE/SINCE</th>
                            <th className="p-3">SERVICE TYPE</th>
                            <th className="p-3">LOCATION</th>
                            <th className="p-3">VEHICLE STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Replace with dynamic data */}
                        <tr className="even:bg-blue-gray-50/50">
                            <td className="p-3">MH12AB3456</td>
                            <td className="p-3">John Doe</td>
                            <td className="p-3">Sample Info</td>
                            <td className="p-3">2025-03-15</td>
                            <td className="p-3">Type Position</td>
                            <td className="p-3">Mumbai</td>
                            <td className="p-3">Active</td>
                        </tr>
                        {/* ... More rows */}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default function FleetMaintenance() {
    // Default active tab
    const [activeTab, setActiveTab] = useState("tyre-maintenance");

    return (
        <div className="">
            <Typography variant="h4" className="mb-4">
                Fleet Maintenance
            </Typography>
            <Card className="rounded-xl shadow-sm">
                <CardBody>
                    <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
                        <TabsHeader>
                            <Tab value="tyre-maintenance">Tyre Maintenance</Tab>
                            <Tab value="vehicle-service">Vehicle Service</Tab>
                            <Tab value="workshop">Workshop</Tab>
                        </TabsHeader>

                        <TabsBody>
                            {/* Tyre Maintenance Tab */}
                            <TabPanel value="tyre-maintenance">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Chart */}
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                    {/* Possibly a second chart or summary (optional) */}
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                </div>
                                <PlaceholderTable title="List View" />
                            </TabPanel>

                            {/* Vehicle Service Tab */}
                            <TabPanel value="vehicle-service">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                </div>
                                <PlaceholderTable title="Service - Days Since Last Service" />
                            </TabPanel>

                            {/* Workshop Tab */}
                            <TabPanel value="workshop">
                                <div className="flex flex-col lg:flex-row gap-4">
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                    <div className="w-full lg:w-1/2">
                                        <RandomPieChart />
                                    </div>
                                </div>
                                <PlaceholderTable title="Workshop Record" />
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
