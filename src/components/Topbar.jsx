import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BellIcon, UserIcon } from "@heroicons/react/24/outline";
import { MdKeyboardArrowDown } from "react-icons/md";
import logo from "../assets/logo.svg"; // Adjust the path if needed
import menuConfig from "./Sidebar/MenuConfig";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  // Handle logout: clear token and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-sm">
      {/* Row 1: Logo and Right-side Controls */}
      <div className="flex items-center justify-between px-16 py-4">
        {/* Logo */}
        <img src={logo} alt="Taabi Logo" className="h-8" />

        {/* Right-side Controls */}
        <div className="flex items-center space-x-6">
          {/* Country Selector */}
          <div className="flex items-center space-x-2 border rounded px-2 py-1 cursor-pointer">
            <img
              src="https://flagcdn.com/w40/in.png"
              alt="India"
              className="w-6 h-4"
            />
            <span>India</span>
            <MdKeyboardArrowDown className="w-4 h-4" />
          </div>

          {/* Notifications */}
          <button className="relative hover:text-black">
            <BellIcon className="w-6 h-6 text-blue-500" />
          </button>

          {/* Account Button with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-1 hover:text-black"
            >
              <UserIcon className="w-5 h-5 text-gray-700" />
              <span>Account</span>
              <MdKeyboardArrowDown className="w-4 h-4" />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Main Navigation */}
      <nav className="flex items-center space-x-8 px-16 py-4 border-t">
        {menuConfig.map((item) => (
          <Link
            key={item.route}
            to={item.route}
            className="flex items-center space-x-1 text-gray-700 hover:text-blue-600"
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Topbar;
