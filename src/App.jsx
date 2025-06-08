// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import pages and layouts
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import FleetUtilization from "./pages/FleetUtilization";
import FleetOperations from "./pages/FleetOperations";
import CreateTrip from "./pages/FleetOperations/CreateTrip";
import FleetMaintenance from "./pages/FleetMaintenance";
import Administration from "./pages/Administration";
import Subscription from "./pages/Subscription";
import Support from "./pages/Support";
import Login from "./pages/Login";
import Alerts from "./pages/Alerts";
import Reports from "./pages/Reports";
// Import the ProtectedRoute component
import ProtectedRoute from "./pages/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/login" element={<Login />} />

      {/* All other routes are protected */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Index route -> Dashboard */}
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="fleet-utilization" element={<FleetUtilization />} />
        <Route path="create-trip" element={<CreateTrip />} />
        <Route path="fleet-operations" element={<FleetOperations />} />
        <Route path="fleet-maintenance" element={<FleetMaintenance />} />
        <Route path="administration" element={<Administration />} />
        <Route path="subscription" element={<Subscription />} />
        <Route path="support" element={<Support />} />
        <Route path="reports" element={<Reports />} />
        <Route path="alerts" element={<Alerts />} />
      </Route>
    </Routes>
  );
}
