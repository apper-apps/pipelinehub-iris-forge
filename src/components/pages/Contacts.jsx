import React, { useState, useEffect } from "react";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await contactService.getAll();
      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      setError(err.message || "Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts]);

  const handleAddContact = () => {
    setEditingContact(null);
    setShowForm(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowForm(true);
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleSaveContact = async (contactData) => {
    try {
      if (editingContact) {
        const updatedContact = await contactService.update(editingContact.Id, contactData);
        setContacts(prev => prev.map(c => c.Id === updatedContact.Id ? updatedContact : c));
      } else {
        const newContact = await contactService.create(contactData);
        setContacts(prev => [...prev, newContact]);
      }
      setShowForm(false);
      setEditingContact(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await contactService.delete(contactId);
        setContacts(prev => prev.filter(c => c.Id !== contactId));
        toast.success("Contact deleted successfully");
      } catch (err) {
        toast.error("Failed to delete contact");
      }
    }
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error
        title="Contacts Error"
        message={error}
        onRetry={loadContacts}
      />
    );
  }

  if (showForm) {
    return (
      <ContactForm
        contact={editingContact}
        onSave={handleSaveContact}
        onCancel={() => {
          setShowForm(false);
          setEditingContact(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-gray-900">Contacts</h1>
        <Button onClick={handleAddContact}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Contact
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <SearchBar
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 max-w-md"
        />
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <ApperIcon name="Filter" size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <ApperIcon name="Download" size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {filteredContacts.length === 0 ? (
        <Empty
          title="No contacts found"
          message={searchTerm ? "No contacts match your search criteria." : "Get started by adding your first contact."}
          icon="Users"
          actionLabel="Add Contact"
          onAction={handleAddContact}
        />
      ) : (
        <ContactTable
          contacts={filteredContacts}
          onEdit={handleEditContact}
          onDelete={handleDeleteContact}
          onView={handleViewContact}
        />
      )}
    </div>
  );
};

export default Contacts;