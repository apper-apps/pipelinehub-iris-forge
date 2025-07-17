import React, { useState, useEffect } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';
import { filterService } from '@/services/api/filterService';
import { toast } from 'react-toastify';

const SavedFilters = ({ type, onApply, className }) => {
  const [savedFilters, setSavedFilters] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadSavedFilters = async () => {
    try {
      setLoading(true);
      const filters = await filterService.getByType(type);
      setSavedFilters(filters);
    } catch (error) {
      toast.error('Failed to load saved filters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSavedFilters();
  }, [type]);

  const handleApplyFilter = (filter) => {
    onApply(filter);
    toast.success(`Applied filter: ${filter.name}`);
  };

  const handleDeleteFilter = async (filterId, filterName) => {
    if (!window.confirm(`Are you sure you want to delete "${filterName}"?`)) {
      return;
    }

    try {
      await filterService.delete(filterId);
      setSavedFilters(prev => prev.filter(f => f.Id !== filterId));
      toast.success('Filter deleted successfully');
    } catch (error) {
      toast.error('Failed to delete filter');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (savedFilters.length === 0) {
    return (
      <div className={cn("text-center py-8", className)}>
        <ApperIcon name="Filter" size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No saved filters yet</p>
        <p className="text-sm text-gray-500 mt-1">
          Create and save filters to quickly access them later
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-display font-semibold text-gray-900">
          Saved Filters
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={loadSavedFilters}
        >
          <ApperIcon name="RefreshCw" size={16} />
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {savedFilters.map((filter) => (
          <div
            key={filter.Id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 truncate">
                {filter.name}
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteFilter(filter.Id, filter.name)}
                className="p-1 text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" size={14} />
              </Button>
            </div>
            
            <div className="mb-3">
              <Badge variant="outline" className="text-xs">
                {filter.conditions.length} condition{filter.conditions.length !== 1 ? 's' : ''}
              </Badge>
            </div>

            <div className="space-y-1 mb-3">
              {filter.conditions.slice(0, 2).map((condition, index) => (
                <div key={index} className="text-xs text-gray-600">
                  {condition.field} {condition.operator} {condition.value}
                </div>
              ))}
              {filter.conditions.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{filter.conditions.length - 2} more
                </div>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => handleApplyFilter(filter)}
              className="w-full"
            >
              <ApperIcon name="Play" size={14} className="mr-2" />
              Apply Filter
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedFilters;