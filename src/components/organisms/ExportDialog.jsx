import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Label from '@/components/atoms/Label';
import Select from '@/components/atoms/Select';
import { exportService } from '@/services/api/exportService';
import { cn } from '@/utils/cn';

const ExportDialog = ({ 
  isOpen, 
  onClose, 
  data, 
  dataType, 
  title = 'Export Data' 
}) => {
  const [format, setFormat] = useState('csv');
  const [filename, setFilename] = useState('');
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  // Initialize dialog state
  useEffect(() => {
    if (isOpen) {
      const columns = exportService.getColumns(dataType);
      setAvailableColumns(columns);
      
      // Set default selected columns
      const defaultSelected = columns.filter(col => col.defaultSelected);
      setSelectedColumns(defaultSelected);
      
      // Set default filename
      const timestamp = new Date().toISOString().split('T')[0];
      setFilename(`${dataType}_export_${timestamp}`);
    }
  }, [isOpen, dataType]);

  // Handle column selection
  const handleColumnToggle = (column) => {
    setSelectedColumns(prev => {
      const isSelected = prev.some(col => col.key === column.key);
      if (isSelected) {
        return prev.filter(col => col.key !== column.key);
      } else {
        return [...prev, column];
      }
    });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    setSelectedColumns([...availableColumns]);
  };

  const handleSelectNone = () => {
    setSelectedColumns([]);
  };

  // Handle export
  const handleExport = async () => {
    if (!data || data.length === 0) {
      toast.error('No data available to export');
      return;
    }

    if (selectedColumns.length === 0) {
      toast.error('Please select at least one column to export');
      return;
    }

    if (!filename.trim()) {
      toast.error('Please enter a filename');
      return;
    }

    setIsExporting(true);
    
    try {
      let result;
      if (format === 'csv') {
        result = await exportService.exportCSV(data, selectedColumns, filename);
      } else {
        result = await exportService.exportExcel(data, selectedColumns, filename, dataType);
      }
      
      toast.success(`${result.message} (${result.recordCount} records)`);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle ESC key
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-display font-bold text-gray-900">
            {title}
          </h2>
          <Button
            variant="outline"
            onClick={onClose}
            className="p-2"
            disabled={isExporting}
          >
            <ApperIcon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Format */}
          <div>
            <Label htmlFor="format" className="block mb-2">
              Export Format
            </Label>
            <Select
              id="format"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              disabled={isExporting}
            >
              <option value="csv">CSV (Comma Separated Values)</option>
              <option value="excel">Excel (XLSX)</option>
            </Select>
          </div>

          {/* Filename */}
          <div>
            <Label htmlFor="filename" className="block mb-2">
              Filename
            </Label>
            <Input
              id="filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter filename"
              disabled={isExporting}
            />
          </div>

          {/* Column Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-base font-medium">
                Select Columns to Export
              </Label>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectAll}
                  disabled={isExporting}
                >
                  Select All
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSelectNone}
                  disabled={isExporting}
                >
                  Select None
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {availableColumns.map((column) => {
                const isSelected = selectedColumns.some(col => col.key === column.key);
                
                return (
                  <label
                    key={column.key}
                    className={cn(
                      "flex items-center space-x-2 p-2 rounded-md cursor-pointer transition-colors",
                      isSelected 
                        ? "bg-primary/10 border border-primary/20" 
                        : "hover:bg-gray-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleColumnToggle(column)}
                      disabled={isExporting}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      {column.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Export Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Records to export: {data?.length || 0}</span>
              <span>Columns selected: {selectedColumns.length}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting || selectedColumns.length === 0 || !filename.trim()}
          >
            {isExporting ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <ApperIcon name="Download" size={16} className="mr-2" />
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportDialog;