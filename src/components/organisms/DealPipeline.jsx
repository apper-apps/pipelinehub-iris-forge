import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import StatusBadge from "@/components/molecules/StatusBadge";
import { format } from "date-fns";

const DealPipeline = ({ deals, onDragStart, onDragOver, onDrop, className }) => {
  const stages = [
    { id: "prospecting", name: "Prospecting", color: "bg-blue-50 border-blue-200" },
    { id: "proposal", name: "Proposal", color: "bg-amber-50 border-amber-200" },
    { id: "negotiation", name: "Negotiation", color: "bg-purple-50 border-purple-200" },
    { id: "closed-won", name: "Closed Won", color: "bg-green-50 border-green-200" },
    { id: "closed-lost", name: "Closed Lost", color: "bg-red-50 border-red-200" },
  ];

  const getDealsByStage = (stage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const getStageValue = (stage) => {
    const stageDeals = getDealsByStage(stage);
    return stageDeals.reduce((total, deal) => total + deal.value, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6", className)}>
      {stages.map((stage) => {
        const stageDeals = getDealsByStage(stage.id);
        const stageValue = getStageValue(stage.id);
        
        return (
          <div
            key={stage.id}
            className={cn("pipeline-stage", stage.color)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <div className="text-xs text-gray-500 bg-white rounded-full px-2 py-1">
                {stageDeals.length}
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-lg font-bold text-gray-900">
                {formatCurrency(stageValue)}
              </p>
            </div>

            <div className="space-y-3">
              {stageDeals.map((deal) => (
                <div
                  key={deal.Id}
                  className="deal-card"
                  draggable
                  onDragStart={(e) => onDragStart(e, deal)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900 truncate">{deal.title}</h4>
                    <ApperIcon name="GripVertical" size={14} className="text-gray-400" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(deal.value)}
                      </span>
                      <span className="text-sm text-gray-500">
                        {deal.probability}%
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <ApperIcon name="Calendar" size={14} className="text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(deal.closeDate), "MMM d")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DealPipeline;