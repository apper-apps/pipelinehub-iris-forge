import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data found", 
  message = "Get started by creating your first item.", 
  icon = "Database",
  actionLabel = "Create New",
  onAction,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 text-center", className)}>
      <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
        <ApperIcon name={icon} size={32} className="text-primary" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md">{message}</p>
      
      {onAction && (
        <Button onClick={onAction} variant="primary">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default Empty;