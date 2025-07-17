import React from "react";
import { cn } from "@/utils/cn";

const StatusBadge = ({ status, className }) => {
  const getStatusStyles = (status) => {
    switch (status?.toLowerCase()) {
      case "new":
        return "status-new";
      case "contacted":
        return "status-contacted";
      case "qualified":
        return "status-qualified";
      case "lost":
        return "status-lost";
      case "completed":
        return "status-completed";
      case "pending":
        return "status-pending";
      case "prospecting":
        return "status-new";
      case "proposal":
        return "status-contacted";
      case "negotiation":
        return "status-qualified";
      case "closed-won":
        return "status-completed";
      case "closed-lost":
        return "status-lost";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={cn("status-pill", getStatusStyles(status), className)}>
      {status}
    </span>
  );
};

export default StatusBadge;