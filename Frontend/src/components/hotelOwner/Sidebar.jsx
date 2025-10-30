import React from "react";
import { assets } from "../../assets/assets";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // This component will be used to render the sidebar for hotel owners
  const sidebarLinks = [
    { name: "Dashboard", path: "/owner", icon: assets.dashboardIcon },
    { name: "Add Rooms", path: "/owner/add-room", icon: assets.addIcon },
    { name: "List Rooms", path: "/owner/list-room", icon: assets.listIcon },
  ];

  return (
    <div className="md:w-64 w-16 h-full text-base border-r border-gray-300 pt-4 flex flex-col transition-all duration-300">
      {sidebarLinks.map((item, index) => (
        <NavLink
          to={item.path}
          key={index}
          end="/owner"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 md:px-8 py-3   ${
              isActive
                ? "border-r-4 md:border-r-[6px] bg-blue-600/10  border-gray-300 text-blue-100"
                : "text-gray-600 hover:bg-gray-100/90 hover:text-gray-800 border-white"
            }`
          }
        >
          <img src={item.icon} alt={item.name} className="h-6 w-6" />
          <span className="md:hidden hidden text-center">{item.name}</span>
        </NavLink>
      ))}
    </div>
  );
};

export default Sidebar;
