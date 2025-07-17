import React, { useState, useEffect } from "react";
import DashboardMetrics from "@/components/organisms/DashboardMetrics";
import PipelineChart from "@/components/organisms/PipelineChart";
import RecentActivities from "@/components/organisms/RecentActivities";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { contactService } from "@/services/api/contactService";
import { dealService } from "@/services/api/dealService";
import { taskService } from "@/services/api/taskService";
import { activityService } from "@/services/api/activityService";

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [contactsData, dealsData, tasksData, activitiesData] = await Promise.all([
        contactService.getAll(),
        dealService.getAll(),
        taskService.getAll(),
        activityService.getRecent(6),
      ]);

      setContacts(contactsData);
      setDeals(dealsData);
      setTasks(tasksData);
      setActivities(activitiesData);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const calculateMetrics = () => {
    const totalContacts = contacts.length;
    const activeDeals = deals.filter(deal => 
      !["closed-won", "closed-lost"].includes(deal.stage)
    ).length;
    const pipelineValue = deals
      .filter(deal => !["closed-won", "closed-lost"].includes(deal.stage))
      .reduce((total, deal) => total + deal.value, 0);
    const pendingTasks = tasks.filter(task => task.status === "pending").length;

    return {
      totalContacts,
      activeDeals,
      pipelineValue,
      pendingTasks,
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg h-24 animate-pulse shimmer"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg h-96 animate-pulse shimmer"></div>
          <div className="bg-white rounded-lg h-96 animate-pulse shimmer"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Error
        title="Dashboard Error"
        message={error}
        onRetry={loadDashboardData}
      />
    );
  }

  const metrics = calculateMetrics();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your pipeline.</p>
      </div>

      <DashboardMetrics metrics={metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PipelineChart deals={deals} />
        </div>
        <div>
          <RecentActivities activities={activities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;