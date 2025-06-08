// src/components/Driver/AddDriverModal.jsx
import React, { useState } from "react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Select,
  Option,
} from "@material-tailwind/react";

// Stub function to simulate file upload.
// Replace with your real file upload API call.
async function uploadFile(file) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("http://example.com/uploadedfile.pdf");
    }, 1000);
  });
}

export default function AddDriverModal({ open, handleClose, onDriverAdded, currentUserId }) {
  const [formData, setFormData] = useState({
    driverName: "",
    mobile: "",
    aadhar: "",
    dlNumber: "",
    dlIssueDate: "",
    dlExpiryDate: "",
    base_salary: "",
    variablePay: "",
    bank_account_no: "",
    bank_ifsc_code: "",
    bank_name: "",
    docType: "license", // default
    fileUrl: "",
  });

  const [file, setFile] = useState(null); // For file input
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("authToken");

  // Update form field values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle document type change from the dropdown
  const handleDocTypeChange = (value) => {
    setFormData((prev) => ({ ...prev, docType: value }));
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  // On submit, if a file is selected, upload it and use its URL in the payload.
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      let uploadedUrl = formData.fileUrl;
      if (file) {
        uploadedUrl = await uploadFile(file);
      }

      const payload = {
        driverName: formData.driverName,
        mobile: formData.mobile,
        aadhar: formData.aadhar,
        dlNumber: formData.dlNumber, // DL Number field included
        dlIssueDate: formData.dlIssueDate,
        dlExpiryDate: formData.dlExpiryDate,
        base_salary: parseFloat(formData.base_salary) || 0,
        variablePay: parseFloat(formData.variablePay) || 0,
        bank_details: {
          account_no: formData.bank_account_no,
          ifsc_code: formData.bank_ifsc_code,
          bank_name: formData.bank_name,
        },
        documents: [
          {
            docType: formData.docType,
            fileUrl: uploadedUrl,
          },
        ],
        // Assigned user is taken from the current user prop.
        assignedUsers: currentUserId ? [currentUserId] : [],
      };

      const response = await fetch("https://api.veyza.in/veyza-api/v0/create-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment the following line if the API requires a Bearer token
          "Authorization": token ? `Bearer ${token}` : "",
      },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || "Failed to create driver.");
      }

      const result = await response.json();
      if (onDriverAdded) {
        onDriverAdded(result.driver || result);
      }
      handleClose();
      // Reset form state
      setFormData({
        driverName: "",
        mobile: "",
        aadhar: "",
        dlNumber: "",
        dlIssueDate: "",
        dlExpiryDate: "",
        base_salary: "",
        variablePay: "",
        bank_account_no: "",
        bank_ifsc_code: "",
        bank_name: "",
        docType: "license",
        fileUrl: "",
      });
      setFile(null);
    } catch (err) {
      console.error("Error adding driver data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} handler={handleClose} size="lg">
      <DialogHeader>Add New Driver</DialogHeader>
      <DialogBody divider>
        <div className="grid grid-cols-2 gap-6">
          {/* LEFT COLUMN */}
          <Input
            label="Driver Name"
            name="driverName"
            value={formData.driverName}
            onChange={handleChange}
          />
          <Input
            label="Mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            type="tel"
          />
          <Input
            label="Aadhaar"
            name="aadhar"
            value={formData.aadhar}
            onChange={handleChange}
          />
          <Input
            label="DL Number"
            name="dlNumber"
            value={formData.dlNumber}
            onChange={handleChange}
            placeholder="DL123456789"
          />
          <Input
            label="DL Issue Date"
            type="date"
            name="dlIssueDate"
            value={formData.dlIssueDate}
            onChange={handleChange}
          />
          <Input
            label="DL Expiry Date"
            type="date"
            name="dlExpiryDate"
            value={formData.dlExpiryDate}
            onChange={handleChange}
          />
          <Input
            label="Base Salary"
            type="number"
            name="base_salary"
            value={formData.base_salary}
            onChange={handleChange}
          />
          <Input
            label="Variable Pay"
            type="number"
            name="variablePay"
            value={formData.variablePay}
            onChange={handleChange}
          />
          {/* RIGHT COLUMN */}
          <Input
            label="Bank Account No."
            name="bank_account_no"
            value={formData.bank_account_no}
            onChange={handleChange}
          />
          <Input
            label="IFSC Code"
            name="bank_ifsc_code"
            value={formData.bank_ifsc_code}
            onChange={handleChange}
          />
          <Input
            label="Bank Name"
            name="bank_name"
            value={formData.bank_name}
            onChange={handleChange}
          />
          <Select
            label="Document Type"
            value={formData.docType}
            onChange={handleDocTypeChange}
          >
            <Option value="license">License</Option>
            <Option value="idProof">ID Proof</Option>
            <Option value="other">Other</Option>
          </Select>
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium text-blue-gray-700">
              Upload Document
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-blue-gray-700
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-blue-gray-50 file:text-blue-gray-700
                         hover:file:bg-blue-gray-100 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </DialogBody>
      <DialogFooter>
        {error && <span className="text-red-500 text-sm mr-4">{error}</span>}
        <Button variant="outlined" color="red" onClick={handleClose} className="mr-2">
          Cancel
        </Button>
        <Button color="green" onClick={handleSubmit} disabled={loading}>
          {loading ? "Adding..." : "Add Driver"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
