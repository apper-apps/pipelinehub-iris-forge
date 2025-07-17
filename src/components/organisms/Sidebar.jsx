import React from "react";
import { cn } from "@/utils/cn";
import NavigationItem from "@/components/molecules/NavigationItem";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose, className }) => {
  const navigation = [
    { to: "/", icon: "BarChart3", label: "Dashboard" },
    { to: "/contacts", icon: "Users", label: "Contacts" },
    { to: "/deals", icon: "Target", label: "Deals" },
    { to: "/tasks", icon: "CheckSquare", label: "Tasks" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="mobile-overlay lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-white border-r border-gray-200 h-screen flex flex-col",
        "lg:relative lg:translate-x-0 lg:static lg:block desktop-sidebar",
        "mobile-sidebar",
        { "open": isOpen },
        className
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-header flex items-center justify-center">
                <ApperIcon name="Target" size={20} className="text-white" />
              </div>
              <span className="text-xl font-display font-bold text-gray-900">
                PipelineHub
              </span>
            </div>
            <button 
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavigationItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <ApperIcon name="User" size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Sales Team</p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;