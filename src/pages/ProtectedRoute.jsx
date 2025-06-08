// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  // Check if the auth token exists (adjust the storage key if needed)
  const token = localStorage.getItem("authToken");

  // If token is absent, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If token is present, render child routes/components
  return children;
};

export default ProtectedRoute;
