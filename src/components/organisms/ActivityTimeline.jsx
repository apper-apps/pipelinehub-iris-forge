import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ActivityTimeline = ({ activities, className }) => {
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

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
      </div>
      
      <div className="p-6">
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={activity.Id}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white",
                      getActivityColor(activity.type)
                    )}>
                      <ApperIcon name={getActivityIcon(activity.type)} size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 capitalize">
                          {activity.type}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ActivityTimeline;