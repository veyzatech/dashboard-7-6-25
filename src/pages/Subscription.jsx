// src/pages/Subscription.jsx
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
    Button,
    Input,
} from "@material-tailwind/react";

export default function Subscription() {
    const [activeTab, setActiveTab] = useState("manage-subscription");

    return (
        <div>
            <Typography variant="h4" className="mb-4">
                Subscription
            </Typography>
            <Card className="rounded-xl shadow-sm">
                <CardBody>
                    <Tabs value={activeTab} onChange={(val) => setActiveTab(val)}>
                        <TabsHeader>
                            <Tab value="manage-subscription">Manage Subscription</Tab>
                            <Tab value="payments">Payments</Tab>
                            <Tab value="payout">Payout</Tab>
                        </TabsHeader>
                        <TabsBody>
                            {/* Manage Subscription Tab */}
                            <TabPanel value="manage-subscription">
                                {/* Filter Row */}
                                <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                                    <Typography variant="h6" className="whitespace-nowrap">
                                        Filter by Expiry Date:
                                    </Typography>
                                    {/* Example: a dropdown or date input */}
                                    <div className="flex-1 md:max-w-xs">
                                        <Input label="Expiry Date" type="date" />
                                    </div>
                                    {/* Optional: a button to apply the filter */}
                                    <Button color="blue" className="normal-case">
                                        Apply
                                    </Button>
                                </div>

                                {/* Subscriptions Table */}
                                <Card>
                                    <CardBody>
                                        <Typography variant="h6" className="mb-2">
                                            Subscriptions
                                        </Typography>
                                        <div className="overflow-x-auto">
                                            <table className="w-full min-w-max table-auto text-left">
                                                <thead>
                                                    <tr className="bg-blue-gray-50">
                                                        <th className="p-3">Expire Date</th>
                                                        <th className="p-3">Vehicle Number</th>
                                                        <th className="p-3">Unique ID</th>
                                                        <th className="p-3">Login ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Example rows (replace with dynamic data) */}
                                                    <tr className="even:bg-blue-gray-50/50">
                                                        <td className="p-3">2025-12-31</td>
                                                        <td className="p-3">MH12AB3456</td>
                                                        <td className="p-3">UDID-12345</td>
                                                        <td className="p-3">user@example.com</td>
                                                    </tr>
                                                    <tr className="even:bg-blue-gray-50/50">
                                                        <td className="p-3">2026-01-15</td>
                                                        <td className="p-3">MH14CD7890</td>
                                                        <td className="p-3">UDID-67890</td>
                                                        <td className="p-3">john.doe</td>
                                                    </tr>
                                                    {/* Add more rows or map over your data */}
                                                </tbody>
                                            </table>
                                        </div>
                                    </CardBody>
                                </Card>
                            </TabPanel>


                            {/* Payments Tab */}
                            <TabPanel value="payments">
                                <Card>
                                    <CardBody>
                                        <Typography variant="h6" className="mb-2">
                                            Payment History
                                        </Typography>
                                        <div className="overflow-x-auto mb-4">
                                            <table className="w-full min-w-max table-auto text-left">
                                                <thead>
                                                    <tr className="bg-blue-gray-50">
                                                        <th className="p-3">ID</th>
                                                        <th className="p-3">Customer ID</th>
                                                        <th className="p-3">Vehicle Number</th>
                                                        <th className="p-3">Payment Date</th>
                                                        <th className="p-3">Payment ID</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {/* Example row */}
                                                    <tr className="even:bg-blue-gray-50/50">
                                                        <td className="p-3">1</td>
                                                        <td className="p-3">CUST-001</td>
                                                        <td className="p-3">MH12AB3456</td>
                                                        <td className="p-3">2025-03-15</td>
                                                        <td className="p-3">PAY-98765</td>
                                                    </tr>
                                                    {/* More rows */}
                                                </tbody>
                                            </table>
                                        </div>
                                        <Button color="green">View All Payments</Button>
                                    </CardBody>
                                </Card>
                            </TabPanel>

                            {/* Payout Tab */}
                            <TabPanel value="payout">
                                <div className="flex gap-4 mb-4">
                                    <Button color="blue">Vendor Payout</Button>
                                    <Button color="green">Driver Payout</Button>
                                </div>
                                {/* Additional Payout UI or table goes here */}
                                <Typography>
                                    Placeholder for vendor/driver payout management...
                                </Typography>
                            </TabPanel>
                        </TabsBody>
                    </Tabs>
                </CardBody>
            </Card>
        </div>
    );
}
