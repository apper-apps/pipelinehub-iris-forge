// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Storage key for saved filters
const STORAGE_KEY = 'savedFilters';

// Get saved filters from localStorage
const getSavedFilters = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Failed to load saved filters:', error);
    return [];
  }
};

// Save filters to localStorage
const saveSavedFilters = (filters) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  } catch (error) {
    console.error('Failed to save filters:', error);
  }
};

let savedFilters = getSavedFilters();

export const filterService = {
  async getAll() {
    await delay(200);
    return [...savedFilters];
  },

  async getById(id) {
    await delay(150);
    const filter = savedFilters.find(f => f.Id === parseInt(id));
    if (!filter) {
      throw new Error("Filter not found");
    }
    return { ...filter };
  },

  async create(filterData) {
    await delay(300);
    const newFilter = {
      ...filterData,
      Id: savedFilters.length > 0 ? Math.max(...savedFilters.map(f => f.Id)) + 1 : 1,
      createdAt: new Date().toISOString(),
    };
    savedFilters.push(newFilter);
    saveSavedFilters(savedFilters);
    return { ...newFilter };
  },

  async update(id, filterData) {
    await delay(250);
    const index = savedFilters.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Filter not found");
    }
    
    const updatedFilter = {
      ...savedFilters[index],
      ...filterData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString(),
    };
    
    savedFilters[index] = updatedFilter;
    saveSavedFilters(savedFilters);
    return { ...updatedFilter };
  },

  async delete(id) {
    await delay(200);
    const index = savedFilters.findIndex(f => f.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Filter not found");
    }
    
    savedFilters.splice(index, 1);
    saveSavedFilters(savedFilters);
    return { success: true };
  },

  async getByType(type) {
    await delay(150);
    return savedFilters.filter(filter => filter.type === type);
  },

  // Validate filter conditions
  validateFilter(filter) {
    if (!filter.name || !filter.conditions || !Array.isArray(filter.conditions)) {
      return false;
    }
    
    return filter.conditions.every(condition => 
      condition.field && condition.operator && condition.value !== undefined
    );
  },
};