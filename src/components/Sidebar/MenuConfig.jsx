// src/components/MenuConfig.js
import {
  MdMap,
  MdOutlineDashboard,
  MdBuild,
  MdAdminPanelSettings,
  MdSubscriptions,
  MdContactSupport
} from "react-icons/md";
import { FaGears } from "react-icons/fa6";


const menuConfig = [
  {
    name: "Dashboard",
    icon: <MdMap className="w-5 h-5" />,
    route: "/dashboard", // <--- route for direct link
  },
  {
    name: "Fleet Performance",
    icon: <MdOutlineDashboard className="w-5 h-5" />,
    route: "/fleet-utilization", // <--- route for direct link
  },
  {
    name: "Fleet Operations",
    icon: <FaGears className="w-5 h-5" />,
    route: "/fleet-operations", // Single route for the consolidated page
  },
  {
    name: "Fleet Maintenance",
    icon: <MdBuild className="w-5 h-5" />,
    route: "/fleet-maintenance", // Single route
  },
  {
    name: "Administration",
    icon: <MdAdminPanelSettings className="w-5 h-5" />,
    route: "/administration"
  },
  {
    name: "Reports",
    icon: <MdSubscriptions className="w-5 h-5" />,
    route: "/reports",
  },
  {
    name: "Alerts",
    icon: <MdSubscriptions className="w-5 h-5" />,
    route: "/alerts",
  },
  {
    name: "Support",
    icon: <MdContactSupport className="w-5 h-5" />,
    route: "/support",
  }
];

export default menuConfig;
