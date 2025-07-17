import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon';
import { filterService } from '@/services/api/filterService';
import { toast } from 'react-toastify';

const FilterBuilder = ({ type, onApply, onCancel, className }) => {
  const [filterName, setFilterName] = useState('');
  const [conditions, setConditions] = useState([
    { field: '', operator: '', value: '', id: Date.now() }
  ]);
  const [loading, setLoading] = useState(false);

  // Field options based on type
  const getFieldOptions = () => {
    if (type === 'contacts') {
      return [
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'company', label: 'Company' },
        { value: 'status', label: 'Status' },
        { value: 'phone', label: 'Phone' },
        { value: 'createdAt', label: 'Created Date' },
        { value: 'lastActivity', label: 'Last Activity' },
        { value: 'tags', label: 'Tags' },
      ];
    } else if (type === 'deals') {
      return [
        { value: 'title', label: 'Deal Title' },
        { value: 'stage', label: 'Stage' },
        { value: 'value', label: 'Value' },
        { value: 'probability', label: 'Probability' },
        { value: 'closeDate', label: 'Close Date' },
        { value: 'createdAt', label: 'Created Date' },
        { value: 'contactId', label: 'Contact' },
        { value: 'tags', label: 'Tags' },
      ];
    }
    return [];
  };

  // Operator options based on field type
  const getOperatorOptions = (field) => {
    if (field === 'value' || field === 'probability') {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'greater', label: 'Greater than' },
        { value: 'less', label: 'Less than' },
        { value: 'between', label: 'Between' },
      ];
    } else if (field === 'createdAt' || field === 'lastActivity' || field === 'closeDate') {
      return [
        { value: 'after', label: 'After' },
        { value: 'before', label: 'Before' },
        { value: 'between', label: 'Between' },
        { value: 'today', label: 'Today' },
        { value: 'this_week', label: 'This week' },
        { value: 'this_month', label: 'This month' },
      ];
    } else if (field === 'status' || field === 'stage') {
      return [
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not equals' },
        { value: 'in', label: 'In' },
      ];
    } else if (field === 'tags') {
      return [
        { value: 'contains', label: 'Contains' },
        { value: 'not_contains', label: 'Does not contain' },
        { value: 'equals', label: 'Equals' },
      ];
    } else {
      return [
        { value: 'contains', label: 'Contains' },
        { value: 'equals', label: 'Equals' },
        { value: 'not_equals', label: 'Not equals' },
        { value: 'starts_with', label: 'Starts with' },
        { value: 'ends_with', label: 'Ends with' },
      ];
    }
  };

  // Status/Stage options
  const getValueOptions = (field) => {
    if (field === 'status') {
      return [
        { value: 'new', label: 'New' },
        { value: 'contacted', label: 'Contacted' },
        { value: 'qualified', label: 'Qualified' },
        { value: 'lost', label: 'Lost' },
      ];
    } else if (field === 'stage') {
      return [
        { value: 'prospecting', label: 'Prospecting' },
        { value: 'proposal', label: 'Proposal' },
        { value: 'negotiation', label: 'Negotiation' },
        { value: 'closed-won', label: 'Closed Won' },
        { value: 'closed-lost', label: 'Closed Lost' },
      ];
    }
    return [];
  };

  const addCondition = () => {
    setConditions([...conditions, { field: '', operator: '', value: '', id: Date.now() }]);
  };

  const removeCondition = (id) => {
    setConditions(conditions.filter(c => c.id !== id));
  };

  const updateCondition = (id, field, value) => {
    setConditions(conditions.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleApply = () => {
    const validConditions = conditions.filter(c => c.field && c.operator && c.value);
    if (validConditions.length === 0) {
      toast.error('Please add at least one valid condition');
      return;
    }

    const filter = {
      conditions: validConditions,
      type,
    };

    onApply(filter);
  };

  const handleSave = async () => {
    if (!filterName.trim()) {
      toast.error('Please enter a filter name');
      return;
    }

    const validConditions = conditions.filter(c => c.field && c.operator && c.value);
    if (validConditions.length === 0) {
      toast.error('Please add at least one valid condition');
      return;
    }

    try {
      setLoading(true);
      const filter = {
        name: filterName,
        conditions: validConditions,
        type,
      };

      await filterService.create(filter);
      toast.success('Filter saved successfully');
      setFilterName('');
    } catch (error) {
      toast.error('Failed to save filter');
    } finally {
      setLoading(false);
    }
  };

  const renderValueInput = (condition) => {
    const options = getValueOptions(condition.field);
    
    if (options.length > 0) {
      return (
        <Select
          value={condition.value}
          onChange={(value) => updateCondition(condition.id, 'value', value)}
          options={options}
          placeholder="Select value"
          className="min-w-[150px]"
        />
      );
    }

    if (condition.field === 'createdAt' || condition.field === 'lastActivity' || condition.field === 'closeDate') {
      return (
        <Input
          type="date"
          value={condition.value}
          onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
          className="min-w-[150px]"
        />
      );
    }

    return (
      <Input
        type={condition.field === 'value' || condition.field === 'probability' ? 'number' : 'text'}
        value={condition.value}
        onChange={(e) => updateCondition(condition.id, 'value', e.target.value)}
        placeholder="Enter value"
        className="min-w-[150px]"
      />
    );
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-xl p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-gray-900">
          Advanced Filter Builder
        </h2>
        <Button
          variant="outline"
          onClick={onCancel}
          className="p-2"
        >
          <ApperIcon name="X" size={16} />
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {conditions.map((condition, index) => (
          <div key={condition.id} className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            {index > 0 && (
              <span className="text-sm font-medium text-gray-500 px-2">AND</span>
            )}
            
            <Select
              value={condition.field}
              onChange={(value) => updateCondition(condition.id, 'field', value)}
              options={getFieldOptions()}
              placeholder="Select field"
              className="min-w-[150px]"
            />
            
            <Select
              value={condition.operator}
              onChange={(value) => updateCondition(condition.id, 'operator', value)}
              options={getOperatorOptions(condition.field)}
              placeholder="Select operator"
              className="min-w-[120px]"
              disabled={!condition.field}
            />
            
            {renderValueInput(condition)}
            
            {conditions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeCondition(condition.id)}
                className="p-2 text-red-600 hover:text-red-700"
              >
                <ApperIcon name="Trash2" size={16} />
              </Button>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          onClick={addCondition}
          className="flex items-center space-x-2"
        >
          <ApperIcon name="Plus" size={16} />
          <span>Add Condition</span>
        </Button>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center space-x-3 mb-4">
          <Input
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Enter filter name to save"
            className="flex-1"
          />
          <Button
            onClick={handleSave}
            disabled={loading || !filterName.trim()}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Save" size={16} />
            <span>Save Filter</span>
          </Button>
        </div>

        <div className="flex items-center justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
          >
            Apply Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterBuilder;