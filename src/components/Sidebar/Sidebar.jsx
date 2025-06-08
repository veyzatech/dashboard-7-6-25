// src/components/Sidebar.jsx
import React, { useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.svg"; // adjust path as needed
import menuConfig from "./MenuConfig";     // your separate config file
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
  MdOutlineLogout,
} from "react-icons/md";

const Sidebar = () => {
  // Track open/closed states for each collapsible group
  const [openGroups, setOpenGroups] = useState({});

  // Toggle a group by name
  const toggleGroup = (groupName) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  return (
    <div className="fixed left-0 top-0 w-60 h-screen bg-white border-r border-gray-200 flex flex-col justify-between p-4">
      {/* --- Top Section: Logo & Menu Items --- */}
      <div>
        {/* Logo */}
        <div className="mb-6">
          <Typography variant="h5" className="font-bold text-blue-gray-800">
            <img src={logo} alt="VEYZA Logo" className="w-auto" />
          </Typography>
        </div>

        {/* Menu Items */}
        <ul>
          {menuConfig.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openGroups[item.name] || false;

            // If item has children => collapsible group
            if (hasChildren) {
              return (
                <li key={item.name} className="mb-2">
                  {item.route ? (
                    /* If there's also a route on the parent, we link directly */
                    <Link to={item.route}>
                      <Button
                        color="light"
                        variant="text"
                        fullWidth
                        className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case px-4 py-2"
                      >
                        {item.icon}
                        <span>{item.name}</span>
                      </Button>
                    </Link>
                  ) : (
                    /* Otherwise we toggle children */
                    <Button
                      color="light"
                      variant="text"
                      fullWidth
                      onClick={() => toggleGroup(item.name)}
                      className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case px-4 py-2"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                      {isOpen ? (
                        <MdOutlineKeyboardArrowUp className="w-5 h-5 ml-auto" />
                      ) : (
                        <MdOutlineKeyboardArrowDown className="w-5 h-5 ml-auto" />
                      )}
                    </Button>
                  )}

                  {/* Collapsible children */}
                  {isOpen && (
                    <ul className="mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.name}>
                          {child.route ? (
                            <Link to={child.route}>
                              <Button
                                color="light"
                                variant="text"
                                fullWidth
                                className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case pl-10 py-2"
                              >
                                {child.icon}
                                <span>{child.name}</span>
                              </Button>
                            </Link>
                          ) : (
                            <Button
                              color="light"
                              variant="text"
                              fullWidth
                              className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case pl-10 py-2"
                            >
                              {child.icon}
                              <span>{child.name}</span>
                            </Button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            // If no children => direct link or plain button
            return item.route ? (
              <li key={item.name} className="mb-2">
                <Link to={item.route}>
                  <Button
                    color="light"
                    variant="text"
                    fullWidth
                    className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case px-4 py-2"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Button>
                </Link>
              </li>
            ) : (
              <li key={item.name} className="mb-2">
                <Button
                  color="light"
                  variant="text"
                  fullWidth
                  className="flex items-center gap-2 justify-start text-blue-gray-700 normal-case px-4 py-2"
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* --- Bottom Section: Logout --- */}
      <div className="mb-5">
        <Button
          color="red"
          variant="text"
          fullWidth
          className="flex items-center gap-2 justify-start normal-case px-4 py-2"
        >
          <MdOutlineLogout className="w-5 h-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
