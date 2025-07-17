import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const RecentActivities = ({ activities, className }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "email":
        return "Mail";
      case "call":
        return "Phone";
      case "meeting":
        return "Users";
      case "note":
        return "FileText";
      case "task":
        return "CheckSquare";
      default:
        return "Activity";
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "email":
        return "bg-blue-100 text-blue-600";
      case "call":
        return "bg-green-100 text-green-600";
      case "meeting":
        return "bg-purple-100 text-purple-600";
      case "note":
        return "bg-amber-100 text-amber-600";
      case "task":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const recentActivities = activities.slice(0, 6);

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.Id} className="flex items-center space-x-4">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                getActivityColor(activity.type)
              )}>
                <ApperIcon name={getActivityIcon(activity.type)} size={16} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentActivities;