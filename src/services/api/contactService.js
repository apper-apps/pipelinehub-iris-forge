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
};