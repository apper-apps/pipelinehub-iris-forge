import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const MetricCard = ({ title, value, icon, trend, trendValue, className }) => {
  const isPositive = trend === "up";
  
  return (
    <div className={cn("metric-card", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name={icon} size={24} className="text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={cn("flex items-center space-x-1 text-sm", {
            "text-success": isPositive,
            "text-error": !isPositive
          })}>
            <ApperIcon 
              name={isPositive ? "TrendingUp" : "TrendingDown"} 
              size={16} 
            />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;