import React from "react";
import { cn } from "@/utils/cn";
import Chart from "react-apexcharts";

const PipelineChart = ({ deals, className }) => {
  const stages = [
    { id: "prospecting", name: "Prospecting" },
    { id: "proposal", name: "Proposal" },
    { id: "negotiation", name: "Negotiation" },
    { id: "closed-won", name: "Closed Won" },
    { id: "closed-lost", name: "Closed Lost" },
  ];

  const getStageData = () => {
    return stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage === stage.id);
      return {
        name: stage.name,
        value: stageDeals.reduce((total, deal) => total + deal.value, 0),
        count: stageDeals.length,
      };
    });
  };

  const stageData = getStageData();

  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#5B47E0", "#8B7FE8", "#3B82F6", "#10B981", "#EF4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: stageData.map(s => s.name),
    },
    yaxis: {
      title: {
        text: "Value ($)",
      },
      labels: {
        formatter: (val) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }).format(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
          }).format(val);
        },
      },
    },
  };

  const chartSeries = [
    {
      name: "Deal Value",
      data: stageData.map(s => s.value),
    },
  ];

  return (
    <div className={cn("bg-white rounded-lg shadow-sm border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Pipeline Overview</h3>
      </div>
      <div className="p-6">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
    </div>
  );
};

export default PipelineChart;