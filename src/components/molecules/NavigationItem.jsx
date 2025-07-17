import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const NavigationItem = ({ to, icon, label, className }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          {
            "gradient-header text-white shadow-md": isActive,
            "text-gray-700 hover:bg-gray-100": !isActive,
          },
          className
        )
      }
    >
      <ApperIcon name={icon} size={20} />
      <span>{label}</span>
    </NavLink>
  );
};

export default NavigationItem;