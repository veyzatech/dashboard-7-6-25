// src/layouts/MainLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Topbar from "../components/Topbar";

export default function MainLayout() {
  return (
    <div>
      {/* <Sidebar /> */}
      <Topbar />
      {/* The nested route content goes here */}
      <div className="px-16 py-4 bg-gray-50 min-h-screen">
        <Outlet />
      </div>

    </div>
  );
}
