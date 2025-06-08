// src/pages/Administration/UserTab.jsx
import React, { useState } from "react";
import { Button } from "@material-tailwind/react";
import SimpleTable from "../../components/SimpleTable";
import AddUserModal from "../../components/User/AddUserModal";

export default function UserTab() {
  // Example columns for the Users table
  const userColumns = [
    "User Name",
    "Assigned Role",
    "Edit",
    "Delete",
    "Reset Password",
    "Status",
  ];

  // Example initial data for the Users table (to be replaced by an API call later)
  const [userData, setUserData] = useState([
    ["John Smith", "Admin", "Edit", "Delete", "Reset", "Active"],
    ["Jane Doe", "Manager", "Edit", "Delete", "Reset", "Active"],
  ]);

  // State to control the "Add User" modal visibility
  const [showModal, setShowModal] = useState(false);

  // Callback when a new user is added via the modal
  const handleUserAdded = (newUser) => {
    const newRow = [
      newUser.userName,
      newUser.assignedRole,
      "Edit",
      "Delete",
      "Reset",
      "Active",
    ];
    setUserData([...userData, newRow]);
  };

  return (
    <div className="p-4">
      <Button onClick={() => setShowModal(true)} color="blue" className="mb-4">
        Add User
      </Button>
      <SimpleTable title="Users" columns={userColumns} data={userData} onAdd={() => setShowModal(true)} />
      <AddUserModal
        open={showModal}
        handleClose={() => setShowModal(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
}
