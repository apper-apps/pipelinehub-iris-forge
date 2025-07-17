import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const TaskList = ({ tasks, onToggleComplete, onEdit, onDelete, className }) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.status === "completed" && b.status !== "completed") return 1;
    if (a.status !== "completed" && b.status === "completed") return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  const isOverdue = (dueDate, status) => {
    return status !== "completed" && new Date(dueDate) < new Date();
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Tasks</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {sortedTasks.map((task) => (
          <div
            key={task.Id}
            className={cn(
              "p-4 hover:bg-gray-50 transition-colors",
              task.status === "completed" && "opacity-60"
            )}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onToggleComplete(task.Id)}
                className={cn(
                  "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
                  task.status === "completed"
                    ? "bg-success border-success text-white"
                    : "border-gray-300 hover:border-primary"
                )}
              >
                {task.status === "completed" && (
                  <ApperIcon name="Check" size={12} />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3 mb-1">
                  <h4 className={cn(
                    "font-medium",
                    task.status === "completed" 
                      ? "text-gray-500 line-through" 
                      : "text-gray-900"
                  )}>
                    {task.title}
                  </h4>
                  <StatusBadge status={task.status} />
                </div>
                
                {task.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <ApperIcon name="Calendar" size={14} />
                    <span className={cn(
                      isOverdue(task.dueDate, task.status) && "text-error font-medium"
                    )}>
                      {format(new Date(task.dueDate), "MMM d, yyyy")}
                    </span>
                  </div>
                  
                  {task.assignedTo && (
                    <div className="flex items-center space-x-1">
                      <ApperIcon name="User" size={14} />
                      <span>{task.assignedTo}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(task)}
                >
                  <ApperIcon name="Edit" size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(task.Id)}
                >
                  <ApperIcon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;