import React from "react";
import { cn } from "@/utils/cn";
import MetricCard from "@/components/molecules/MetricCard";

const DashboardMetrics = ({ metrics, className }) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
      <MetricCard
        title="Total Contacts"
        value={metrics.totalContacts}
        icon="Users"
        trend="up"
        trendValue="+12%"
      />
      
      <MetricCard
        title="Active Deals"
        value={metrics.activeDeals}
        icon="Target"
        trend="up"
        trendValue="+8%"
      />
      
      <MetricCard
        title="Pipeline Value"
        value={new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
        }).format(metrics.pipelineValue)}
        icon="DollarSign"
        trend="up"
        trendValue="+15%"
      />
      
      <MetricCard
        title="Pending Tasks"
        value={metrics.pendingTasks}
        icon="CheckSquare"
        trend="down"
        trendValue="-5%"
      />
    </div>
  );
};

export default DashboardMetrics;