import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) {
      throw new Error("Deal not found");
    }
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    const updatedDeal = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
    };
    
    deals[index] = updatedDeal;
    return { ...updatedDeal };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals.splice(index, 1);
    return { success: true };
  },

  async updateStage(id, newStage) {
    await delay(200);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Deal not found");
    }
    
    deals[index].stage = newStage;
    return { ...deals[index] };
  },

  async getByStage(stage) {
    await delay(200);
    return deals.filter(deal => deal.stage === stage);
  },
async filterDeals(deals, conditions) {
    await delay(250);
    
    return deals.filter(deal => {
      return conditions.every(condition => {
        const { field, operator, value } = condition;
        const fieldValue = deal[field];
        
        if (fieldValue === undefined || fieldValue === null) {
          return false;
        }
        
        switch (operator) {
          case 'equals':
            return fieldValue.toString().toLowerCase() === value.toLowerCase();
          case 'not_equals':
            return fieldValue.toString().toLowerCase() !== value.toLowerCase();
          case 'contains':
            return fieldValue.toString().toLowerCase().includes(value.toLowerCase());
          case 'not_contains':
            return !fieldValue.toString().toLowerCase().includes(value.toLowerCase());
          case 'starts_with':
            return fieldValue.toString().toLowerCase().startsWith(value.toLowerCase());
          case 'ends_with':
            return fieldValue.toString().toLowerCase().endsWith(value.toLowerCase());
          case 'greater':
            return parseFloat(fieldValue) > parseFloat(value);
          case 'less':
            return parseFloat(fieldValue) < parseFloat(value);
          case 'between':
            const [min, max] = value.split(',').map(v => parseFloat(v.trim()));
            return parseFloat(fieldValue) >= min && parseFloat(fieldValue) <= max;
          case 'after':
            return new Date(fieldValue) > new Date(value);
          case 'before':
            return new Date(fieldValue) < new Date(value);
          case 'today':
            const today = new Date();
            const dealDate = new Date(fieldValue);
            return dealDate.toDateString() === today.toDateString();
          case 'this_week':
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
            const dealDateWeek = new Date(fieldValue);
            return dealDateWeek >= weekStart && dealDateWeek <= weekEnd;
          case 'this_month':
            const monthStart = new Date();
            monthStart.setDate(1);
            const monthEnd = new Date();
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            const dealDateMonth = new Date(fieldValue);
            return dealDateMonth >= monthStart && dealDateMonth <= monthEnd;
          case 'in':
            return value.split(',').map(v => v.trim().toLowerCase()).includes(fieldValue.toString().toLowerCase());
          default:
            return true;
        }
      });
    });
  },
};