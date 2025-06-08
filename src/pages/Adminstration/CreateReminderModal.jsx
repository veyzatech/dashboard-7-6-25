// src/components/CreateReminderModal.jsx
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";

const CreateReminderModal = ({ open, handleClose, onReminderCreated, token }) => {
  const [formData, setFormData] = useState({
    vehicle: "",
    documentType: "",
    expiryDate: "",
    documentFile: null,
  });
  const [reminderMethods, setReminderMethods] = useState([]);
  const [reminderEmail, setReminderEmail] = useState("");
  const [reminderWhatsApp, setReminderWhatsApp] = useState("");
  const [alertBeforeDays, setAlertBeforeDays] = useState(7);
  const [vehicles, setVehicles] = useState([]);
  const [vehicleLoading, setVehicleLoading] = useState(true);
  const [vehicleError, setVehicleError] = useState("");

  // Fetch vehicles on modal open
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("https://api.veyza.in/veyza-api/v0/vehicles", {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (!response.ok) throw new Error("Failed to fetch vehicles");
        const data = await response.json();
        setVehicles(Array.isArray(data) ? data : data.data || []);
        setVehicleLoading(false);
      } catch (err) {
        console.error("Error fetching vehicles:", err);
        setVehicleError(err.message);
        setVehicleLoading(false);
      }
    }
    if (open) fetchVehicles();
  }, [open, token]);

  // Update state for inputs and file upload
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "documentFile") {
      setFormData((prev) => ({ ...prev, documentFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleMethodsCheckbox = (e) => {
    const { value, checked } = e.target;
    setReminderMethods((prev) =>
      checked ? [...prev, value] : prev.filter((m) => m !== value)
    );
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, documentFile: e.target.files[0] }));
    }
  };

  // Combined submit: create a FormData with file and text fields and send to the API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.vehicle ||
      !formData.documentType ||
      !formData.expiryDate ||
      !formData.documentFile
    ) {
      alert("Please fill all required fields including file upload");
      return;
    }

    // Create a new FormData and append all necessary values
    const combinedFormData = new FormData();
    // The file is expected under the key "docFile"
    combinedFormData.append("docFile", formData.documentFile);
    combinedFormData.append("vehicle", formData.vehicle);
    combinedFormData.append("documentType", formData.documentType);
    combinedFormData.append("expiryDate", formData.expiryDate);
    // Optionally, you may append issuedDate or uploadedBy if needed:
    // combinedFormData.append("issuedDate", formData.issuedDate);
    // combinedFormData.append("uploadedBy", formData.uploadedBy);

    // Append reminder settings as a JSON string.
    combinedFormData.append(
      "reminderSettings",
      JSON.stringify({
        reminderMethods,
        reminderEmail,
        reminderWhatsApp,
        alertBeforeDays,
      })
    );

    try {
      const response = await fetch("https://api.veyza.in/veyza-api/v0/upload/vehicle-document", {
        method: "POST",
        // Do not manually set Content-Type; let the browser set it with correct boundaries
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: combinedFormData,
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create document reminder");
      }
      const result = await response.json();
      alert("Document reminder created successfully!");
      if (onReminderCreated) onReminderCreated(result.document || result);
      // Reset the form
      setFormData({
        vehicle: "",
        documentType: "",
        expiryDate: "",
        documentFile: null,
      });
      setReminderMethods([]);
      setReminderEmail("");
      setReminderWhatsApp("");
      setAlertBeforeDays(7);
      handleClose();
    } catch (error) {
      console.error("Error creating document reminder:", error);
      alert("Error: " + error.message);
    }
  };

  return (
    <Dialog open={open} handler={handleClose} size="lg">
      <DialogHeader>
        <Typography variant="h5" className="font-bold">
          Create New Document Reminder
        </Typography>
      </DialogHeader>
      <DialogBody className="pointer-events-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Dropdown */}
          <div>
            <Typography variant="small" className="font-medium mb-1">
              Select Vehicle
            </Typography>
            <Select
              name="vehicle"
              value={formData.vehicle}
              onChange={(value) =>
                setFormData((prev) => ({ ...prev, vehicle: value }))
              }
              required
            >
              {vehicleLoading ? (
                <Option>Loading...</Option>
              ) : vehicleError ? (
                <Option>Error fetching vehicles</Option>
              ) : vehicles.length === 0 ? (
                <Option>No vehicles found</Option>
              ) : (
                vehicles.map((v) => (
                  <Option key={v._id} value={v._id}>
                    {v.vehicleNumber}
                  </Option>
                ))
              )}
            </Select>
          </div>
          <Input
            id="documentType"
            label="Reminder Name / Document Type"
            name="documentType"
            value={formData.documentType || ""}
            onChange={handleChange}
            required
          />
          <Input
            id="expiryDate"
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={formData.expiryDate || ""}
            onChange={handleChange}
            required
          />
          <div className="flex flex-col">
            <Typography variant="small" className="font-medium mb-1">
              Upload Document
            </Typography>
            <label
              htmlFor="documentFile"
              className="flex items-center justify-center px-4 py-2 border rounded-md border-blue-gray-200 shadow-sm hover:bg-blue-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Choose File
            </label>
            <input
              id="documentFile"
              type="file"
              name="documentFile"
              onChange={handleFileChange}
              className="hidden"
            />
            {formData.documentFile && (
              <Typography variant="small" className="mt-1 text-gray-600">
                {formData.documentFile.name}
              </Typography>
            )}
          </div>
          {/* Reminder Settings */}
          <div className="border-t pt-4">
            <Typography variant="small" className="font-bold mb-2">
              Reminder Settings
            </Typography>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="email"
                  onChange={handleMethodsCheckbox}
                  checked={reminderMethods.includes("email")}
                />
                <Typography variant="small">Email</Typography>
              </label>
              {reminderMethods.includes("email") && (
                <Input
                  id="reminderEmail"
                  label="Reminder Email"
                  name="reminderEmail"
                  value={reminderEmail || ""}
                  onChange={(e) => setReminderEmail(e.target.value)}
                />
              )}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value="whatsapp"
                  onChange={handleMethodsCheckbox}
                  checked={reminderMethods.includes("whatsapp")}
                />
                <Typography variant="small">WhatsApp</Typography>
              </label>
              {reminderMethods.includes("whatsapp") && (
                <Input
                  id="reminderWhatsApp"
                  label="WhatsApp Number"
                  name="reminderWhatsApp"
                  value={reminderWhatsApp || ""}
                  onChange={(e) => setReminderWhatsApp(e.target.value)}
                />
              )}
              <Input
                id="alertBeforeDays"
                label="Alert Before (Days)"
                name="alertBeforeDays"
                type="number"
                value={alertBeforeDays}
                onChange={(e) => setAlertBeforeDays(e.target.value)}
                min="1"
              />
            </div>
          </div>
          <div className="flex justify-end gap-4">
            <Button variant="outlined" color="red" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" color="green">
              Create Reminder
            </Button>
          </div>
        </form>
      </DialogBody>
      <DialogFooter className="pointer-events-auto" />
    </Dialog>
  );
};

export default CreateReminderModal;
