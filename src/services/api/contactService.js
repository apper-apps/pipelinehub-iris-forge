import contactsData from "@/services/mockData/contacts.json";

let contacts = [...contactsData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const contactService = {
  async getAll() {
    await delay(300);
    return [...contacts];
  },

  async getById(id) {
    await delay(200);
    const contact = contacts.find(c => c.Id === parseInt(id));
    if (!contact) {
      throw new Error("Contact not found");
    }
    return { ...contact };
  },

async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      Id: Math.max(...contacts.map(c => c.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      notes: contactData.notes || "",
    };
    contacts.push(newContact);
    return { ...newContact };
  },

  async update(id, contactData) {
    await delay(350);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    const updatedContact = {
      ...contacts[index],
      ...contactData,
      Id: parseInt(id),
      lastActivity: new Date().toISOString(),
    };
    
    contacts[index] = updatedContact;
    return { ...updatedContact };
  },

  async delete(id) {
    await delay(250);
    const index = contacts.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Contact not found");
    }
    
    contacts.splice(index, 1);
    return { success: true };
  },

  async search(query) {
    await delay(200);
    const searchTerm = query.toLowerCase();
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm) ||
      contact.email.toLowerCase().includes(searchTerm) ||
      contact.company.toLowerCase().includes(searchTerm)
    );
  },
async filterContacts(contacts, conditions) {
    await delay(250);
    
    return contacts.filter(contact => {
      return conditions.every(condition => {
        const { field, operator, value } = condition;
        const fieldValue = contact[field];
        
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
          case 'after':
            return new Date(fieldValue) > new Date(value);
          case 'before':
            return new Date(fieldValue) < new Date(value);
          case 'today':
            const today = new Date();
            const contactDate = new Date(fieldValue);
            return contactDate.toDateString() === today.toDateString();
          case 'this_week':
            const weekStart = new Date();
            weekStart.setDate(weekStart.getDate() - weekStart.getDay());
            const weekEnd = new Date();
            weekEnd.setDate(weekEnd.getDate() + (6 - weekEnd.getDay()));
            const contactDateWeek = new Date(fieldValue);
            return contactDateWeek >= weekStart && contactDateWeek <= weekEnd;
          case 'this_month':
            const monthStart = new Date();
            monthStart.setDate(1);
            const monthEnd = new Date();
            monthEnd.setMonth(monthEnd.getMonth() + 1);
            monthEnd.setDate(0);
            const contactDateMonth = new Date(fieldValue);
            return contactDateMonth >= monthStart && contactDateMonth <= monthEnd;
          case 'in':
            return value.split(',').map(v => v.trim().toLowerCase()).includes(fieldValue.toString().toLowerCase());
          default:
            return true;
        }
      });
    });
  },
};