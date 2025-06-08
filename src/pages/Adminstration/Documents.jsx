// src/pages/Administration/DocumentReminders.jsx
import React, { useState, useEffect, Fragment } from "react";
import {
  Card,
  Typography,
  Button,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import CreateReminderModal from "./CreateReminderModal";

// Helper function to derive reminder status
const getReminderStatus = (reminder) => {
  if (reminder.resolved) return "Resolved";
  const now = new Date();
  const expiry = new Date(reminder.expiryDate);
  return expiry < now ? "Overdue" : "Upcoming";
};

// Render Reminders Table
const renderRemindersTable = (remindersToRender) => {
  if (!remindersToRender || remindersToRender.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-500">
        <img src="https://via.placeholder.com/150" alt="No data" className="mb-4" />
        <Typography variant="h6" className="mb-2">
          No Reminders Available
        </Typography>
        <Typography variant="small" color="gray">
          There are no document reminders in this category.
        </Typography>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-max table-auto text-left">
        <thead className="bg-blue-gray-50">
          <tr>
            <th className="px-4 py-2">Reminder Name</th>
            <th className="px-4 py-2">Reminder Expiry Date</th>
            <th className="px-4 py-2">Reminder Status</th>
          </tr>
        </thead>
        <tbody>
          {remindersToRender.map((reminder) => (
            <tr key={reminder._id} className="bg-white even:bg-blue-gray-50/50">
              <td className="px-4 py-2">{reminder.documentType || "N/A"}</td>
              <td className="px-4 py-2">
                {reminder.expiryDate ? new Date(reminder.expiryDate).toLocaleDateString() : "N/A"}
              </td>
              <td className="px-4 py-2">{getReminderStatus(reminder)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function DocumentReminders() {
  const [reminders, setReminders] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("authToken");

  // Fetch reminders on mount
  const fetchReminders = async () => {
    try {
      const response = await fetch("https://api.veyza.in/veyza-api/v0/vehicle-documents", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch reminders");
      const data = await response.json();
      setReminders(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Error fetching reminders:", error);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, [token]);

  return (
    <Fragment>
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <Typography variant="h4">Document Reminders</Typography>
          <div className="flex gap-2">
            <Button
              onClick={() => alert("Bulk Upload clicked")}
              variant="outlined"
              color="blue"
              className="flex items-center gap-2"
            >
              <CloudArrowUpIcon className="h-5 w-5" />
              Bulk Upload
            </Button>
            <Button onClick={() => setShowModal(true)} color="blue">
              Create New Reminder
            </Button>
          </div>
        </div>
        <Card className="rounded-xl shadow-sm mb-4">
          <div className="px-4 py-2">
            <Tabs value={activeTab} onChange={setActiveTab}>
              <TabsHeader>
                <Tab value="all">All Reminders</Tab>
                <Tab value="upcoming">Upcoming</Tab>
                <Tab value="overdue">Overdue</Tab>
                <Tab value="resolved">Resolved</Tab>
              </TabsHeader>
              <TabsBody>
                <TabPanel value="all">{renderRemindersTable(reminders)}</TabPanel>
                <TabPanel value="upcoming">
                  {renderRemindersTable(
                    reminders.filter((r) => new Date(r.expiryDate) >= new Date() && !r.resolved)
                  )}
                </TabPanel>
                <TabPanel value="overdue">
                  {renderRemindersTable(
                    reminders.filter((r) => new Date(r.expiryDate) < new Date() && !r.resolved)
                  )}
                </TabPanel>
                <TabPanel value="resolved">
                  {renderRemindersTable(reminders.filter((r) => r.resolved))}
                </TabPanel>
              </TabsBody>
            </Tabs>
          </div>
        </Card>
      </div>

      <CreateReminderModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        onReminderCreated={fetchReminders}
        token={token}
      />
    </Fragment>
  );
}
