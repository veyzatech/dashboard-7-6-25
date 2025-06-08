// src/pages/Administration/Alerts.jsx
import React, { useState, Fragment } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
  Input,
} from "@material-tailwind/react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";

// Sample alerts data (for demo purposes)
const sampleAlerts = [
  {
    _id: "1",
    alertType: "Over Speed",
    timestamp: new Date().toISOString(),
    vehicleNo: "GJ16Z5115",
  },
  {
    _id: "2",
    alertType: "Panic Alert",
    timestamp: new Date(Date.now() - 3600 * 1000).toISOString(), // one hour ago
    vehicleNo: "MH12AB3456",
  },
  {
    _id: "3",
    alertType: "Device Offline",
    timestamp: new Date(Date.now() - 7200 * 1000).toISOString(), // two hours ago
    vehicleNo: "MH14CD7890",
  },
];

export default function Alerts() {
  // State for alerts list, which in this demo uses sample data.
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [activeTab, setActiveTab] = useState("all");
  const [showConfigureModal, setShowConfigureModal] = useState(false);

  // For the demo, we use the same sample data for every tab.
  // In a real application, you might filter by alert type or other criteria.
  const allAlerts = alerts;
  const upcomingAlerts = alerts; // Adjust filtering as needed.
  const overdueAlerts = alerts;  // Adjust filtering as needed.
  const resolvedAlerts = [];      // For demo, assume none are resolved.

  // Renders the alerts table with three columns.
  const renderAlertsTable = (alertsToRender) => {
    if (!alertsToRender || alertsToRender.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-10 text-gray-500">
          <img
            src="https://via.placeholder.com/150"
            alt="No data"
            className="mb-4"
          />
          <Typography variant="h6" className="mb-2">
            No Alerts Available
          </Typography>
          <Typography variant="small" color="gray">
            There are no alerts at this time.
          </Typography>
        </div>
      );
    }
    return (
      <div className="overflow-x-auto">
        <table className="w-full min-w-max table-auto text-left">
          <thead className="bg-blue-gray-50">
            <tr>
              <th className="px-4 py-2">Alert Type</th>
              <th className="px-4 py-2">Timestamp</th>
              <th className="px-4 py-2">Vehicle</th>
            </tr>
          </thead>
          <tbody>
            {alertsToRender.map((alertItem, idx) => (
              <tr key={alertItem._id} className={idx % 2 === 1 ? "bg-blue-gray-50/50" : "bg-white"}>
                <td className="px-4 py-2">{alertItem.alertType || "N/A"}</td>
                <td className="px-4 py-2">
                  {alertItem.timestamp ? new Date(alertItem.timestamp).toLocaleString() : "N/A"}
                </td>
                <td className="px-4 py-2">{alertItem.vehicleNo || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // --- Configure Alerts Modal ---
  // This modal lets you configure custom alert settings.
  const ConfigureAlertsModal = ({ open, onClose }) => {
    const [customAlertName, setCustomAlertName] = useState("");
    const [customAlertCondition, setCustomAlertCondition] = useState("");

    const handleSave = () => {
      // For demonstration, simply log the new configuration.
      console.log("Saving custom alert:", {
        customAlertName,
        customAlertCondition,
      });
      alert("Custom alert configuration saved!");
      // Reset fields and close modal.
      setCustomAlertName("");
      setCustomAlertCondition("");
      onClose();
    };

    if (!open) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md">
          <Typography variant="h5" className="mb-4 font-bold">
            Configure Custom Alert
          </Typography>
          <div className="mb-4 flex flex-col gap-2">
            <label className="font-medium text-sm text-blue-gray-600">Alert Name</label>
            <input
              type="text"
              value={customAlertName}
              onChange={(e) => setCustomAlertName(e.target.value)}
              className="border border-blue-gray-300 rounded px-3 py-2"
            />
            <label className="font-medium text-sm text-blue-gray-600">Alert Condition</label>
            <input
              type="text"
              value={customAlertCondition}
              onChange={(e) => setCustomAlertCondition(e.target.value)}
              className="border border-blue-gray-300 rounded px-3 py-2"
              placeholder='e.g. "speed > 120"'
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button color="red" variant="outlined" onClick={onClose}>
              Cancel
            </Button>
            <Button color="green" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className="p-4">
        <Typography variant="h4" className="mb-4">
          Alerts
        </Typography>
        <Card className="rounded-xl shadow-sm">
          <CardBody>
            <div className="flex items-center justify-between mb-4">
              <Typography variant="h6">Alerts Table</Typography>
              <Button color="blue" onClick={() => setShowConfigureModal(true)}>
                Configure Alerts
              </Button>
            </div>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <TabsHeader>
                <Tab value="all">All Alerts</Tab>
                <Tab value="upcoming">Upcoming</Tab>
                <Tab value="overdue">Overdue</Tab>
                <Tab value="resolved">Resolved</Tab>
              </TabsHeader>
              <TabsBody>
                <TabPanel value="all">{renderAlertsTable(allAlerts)}</TabPanel>
                <TabPanel value="upcoming">{renderAlertsTable(upcomingAlerts)}</TabPanel>
                <TabPanel value="overdue">{renderAlertsTable(overdueAlerts)}</TabPanel>
                <TabPanel value="resolved">{renderAlertsTable(resolvedAlerts)}</TabPanel>
              </TabsBody>
            </Tabs>
          </CardBody>
        </Card>
      </div>

      <ConfigureAlertsModal
        open={showConfigureModal}
        onClose={() => setShowConfigureModal(false)}
      />
    </Fragment>
  );
}
