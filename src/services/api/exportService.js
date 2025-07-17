import * as XLSX from 'xlsx';

// Column definitions for different data types
const COLUMN_DEFINITIONS = {
  contacts: [
    { key: 'Id', label: 'ID', defaultSelected: false },
    { key: 'name', label: 'Name', defaultSelected: true },
    { key: 'email', label: 'Email', defaultSelected: true },
    { key: 'phone', label: 'Phone', defaultSelected: true },
    { key: 'company', label: 'Company', defaultSelected: true },
    { key: 'status', label: 'Status', defaultSelected: true },
    { key: 'createdAt', label: 'Created Date', defaultSelected: false },
    { key: 'lastActivity', label: 'Last Activity', defaultSelected: false }
  ],
  deals: [
    { key: 'Id', label: 'ID', defaultSelected: false },
    { key: 'title', label: 'Title', defaultSelected: true },
    { key: 'value', label: 'Value', defaultSelected: true },
    { key: 'stage', label: 'Stage', defaultSelected: true },
    { key: 'contactId', label: 'Contact ID', defaultSelected: false },
    { key: 'probability', label: 'Probability', defaultSelected: true },
    { key: 'closeDate', label: 'Close Date', defaultSelected: true },
    { key: 'createdAt', label: 'Created Date', defaultSelected: false }
  ]
};

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Format value based on column type
const formatValue = (value, key) => {
  if (value === null || value === undefined) return '';
  
  switch (key) {
    case 'value':
      return typeof value === 'number' ? value.toFixed(2) : value;
    case 'probability':
      return typeof value === 'number' ? `${value}%` : value;
    case 'createdAt':
    case 'lastActivity':
    case 'closeDate':
      try {
        return new Date(value).toLocaleDateString();
      } catch {
        return value;
      }
    default:
      return value.toString();
  }
};

// Generate CSV content
const generateCSV = (data, selectedColumns) => {
  if (!data || data.length === 0) return '';
  
  // Create headers
  const headers = selectedColumns.map(col => col.label);
  
  // Create rows
  const rows = data.map(item => 
    selectedColumns.map(col => {
      const value = formatValue(item[col.key], col.key);
      // Escape quotes and wrap in quotes if contains comma or quote
      return value.includes(',') || value.includes('"') 
        ? `"${value.replace(/"/g, '""')}"` 
        : value;
    })
  );
  
  // Combine headers and rows
  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  return csvContent;
};

// Generate Excel workbook
const generateExcel = (data, selectedColumns, sheetName) => {
  if (!data || data.length === 0) return null;
  
  // Prepare data for Excel
  const excelData = data.map(item => {
    const row = {};
    selectedColumns.forEach(col => {
      row[col.label] = formatValue(item[col.key], col.key);
    });
    return row;
  });
  
  // Create workbook and worksheet
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(excelData);
  
  // Set column widths
  const colWidths = selectedColumns.map(col => ({
    wch: Math.max(col.label.length, 15)
  }));
  ws['!cols'] = colWidths;
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  
  return wb;
};

// Download file
const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

export const exportService = {
  // Get available columns for data type
  getColumns(dataType) {
    return COLUMN_DEFINITIONS[dataType] || [];
  },
  
  // Export data as CSV
  async exportCSV(data, selectedColumns, filename) {
    await delay(500); // Simulate processing time
    
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }
    
    if (!selectedColumns || selectedColumns.length === 0) {
      throw new Error('No columns selected');
    }
    
    try {
      const csvContent = generateCSV(data, selectedColumns);
      const fullFilename = filename.endsWith('.csv') ? filename : `${filename}.csv`;
      
      downloadFile(csvContent, fullFilename, 'text/csv;charset=utf-8;');
      
      return {
        success: true,
        message: `CSV file "${fullFilename}" downloaded successfully`,
        recordCount: data.length
      };
    } catch (error) {
      throw new Error(`Failed to export CSV: ${error.message}`);
    }
  },
  
  // Export data as Excel
  async exportExcel(data, selectedColumns, filename, sheetName = 'Sheet1') {
    await delay(500); // Simulate processing time
    
    if (!data || data.length === 0) {
      throw new Error('No data to export');
    }
    
    if (!selectedColumns || selectedColumns.length === 0) {
      throw new Error('No columns selected');
    }
    
    try {
      const workbook = generateExcel(data, selectedColumns, sheetName);
      if (!workbook) {
        throw new Error('Failed to generate Excel file');
      }
      
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const fullFilename = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;
      
      downloadFile(excelBuffer, fullFilename, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      
      return {
        success: true,
        message: `Excel file "${fullFilename}" downloaded successfully`,
        recordCount: data.length
      };
    } catch (error) {
      throw new Error(`Failed to export Excel: ${error.message}`);
    }
  }
};