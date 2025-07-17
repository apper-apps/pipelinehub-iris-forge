import React from "react";
import { cn } from "@/utils/cn";

const Loading = ({ className, type = "default" }) => {
  if (type === "table") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="space-y-4">
          {/* Header */}
          <div className="h-10 bg-gray-200 rounded-md"></div>
          
          {/* Table rows */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="h-16 bg-gray-200 rounded-md flex-1"></div>
              <div className="h-16 bg-gray-200 rounded-md flex-1"></div>
              <div className="h-16 bg-gray-200 rounded-md flex-1"></div>
              <div className="h-16 bg-gray-200 rounded-md w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-48 shimmer"></div>
            <div className="mt-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4 shimmer"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 shimmer"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "pipeline") {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6", className)}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-8 mb-4 shimmer"></div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="bg-gray-200 rounded-lg h-32 shimmer"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("animate-pulse space-y-4", className)}>
      <div className="h-8 bg-gray-200 rounded-md w-1/3 shimmer"></div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6 shimmer"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6 shimmer"></div>
      </div>
    </div>
  );
};

export default Loading;