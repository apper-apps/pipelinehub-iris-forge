import React, { useState, useEffect } from "react";
import ContactTable from "@/components/organisms/ContactTable";
import ContactForm from "@/components/organisms/ContactForm";
import FilterBuilder from "@/components/organisms/FilterBuilder";
import SavedFilters from "@/components/organisms/SavedFilters";
import ExportDialog from "@/components/organisms/ExportDialog";
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
  const [showFilterBuilder, setShowFilterBuilder] = useState(false);
  const [showSavedFilters, setShowSavedFilters] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [activeFilter, setActiveFilter] = useState(null);

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
    applyFilters();
  }, [searchTerm, contacts, activeFilter]);

  const applyFilters = async () => {
    let filtered = [...contacts];

// Apply search filter
        if (searchTerm) {
          filtered = filtered.filter(contact =>
            contact.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contact.company.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

    // Apply advanced filter
    if (activeFilter && activeFilter.conditions) {
      try {
        filtered = await contactService.filterContacts(filtered, activeFilter.conditions);
      } catch (error) {
        toast.error('Failed to apply filter');
      }
    }

    setFilteredContacts(filtered);
  };

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
    if (editingContact) {
      const updatedContact = await contactService.update(editingContact.Id, contactData);
      setContacts(prev => prev.map(c => c.Id === updatedContact.Id ? updatedContact : c));
    } else {
      const newContact = await contactService.create(contactData);
      setContacts(prev => [...prev, newContact]);
    }
    setShowForm(false);
    setEditingContact(null);
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

  const handleShowFilterBuilder = () => {
    setShowFilterBuilder(true);
  };

  const handleShowSavedFilters = () => {
    setShowSavedFilters(true);
  };

  const handleApplyFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilterBuilder(false);
    setShowSavedFilters(false);
    toast.success('Filter applied successfully');
  };

  const handleClearFilter = () => {
    setActiveFilter(null);
    toast.info('Filter cleared');
  };

  const handleCloseFilterBuilder = () => {
    setShowFilterBuilder(false);
  };

  const handleCloseSavedFilters = () => {
    setShowSavedFilters(false);
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

const handleModalClose = () => {
    setShowForm(false);
    setEditingContact(null);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleModalClose();
    }
  };
return (
    <>
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
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowFilterBuilder}
            >
              <ApperIcon name="Filter" size={16} className="mr-2" />
              Advanced Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShowSavedFilters}
            >
              <ApperIcon name="Bookmark" size={16} className="mr-2" />
              Saved Filters
            </Button>
            {activeFilter && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleClearFilter}
                className="text-red-600 hover:text-red-700"
              >
                <ApperIcon name="X" size={16} className="mr-2" />
                Clear Filter
              </Button>
            )}
<Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowExportDialog(true)}
            >
              <ApperIcon name="Download" size={16} className="mr-2" />
              Export
            </Button>
          </div>
</div>

        {/* Active Filter Display */}
        {activeFilter && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Filter" size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-blue-800">
                  Active Filter: {activeFilter.name || 'Custom Filter'}
                </span>
                <span className="text-xs text-blue-600">
                  ({activeFilter.conditions.length} condition{activeFilter.conditions.length !== 1 ? 's' : ''})
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilter}
                className="text-blue-600 hover:text-blue-700"
              >
                <ApperIcon name="X" size={14} />
              </Button>
            </div>
          </div>
        )}

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

      {/* Contact Form Modal */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleBackdropClick}
        >
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <ContactForm
              contact={editingContact}
              onSave={handleSaveContact}
              onCancel={handleModalClose}
              className="shadow-2xl"
            />
          </div>
        </div>
)}

      {/* Filter Builder Modal */}
      {showFilterBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <FilterBuilder
              type="contacts"
              onApply={handleApplyFilter}
              onCancel={handleCloseFilterBuilder}
            />
          </div>
        </div>
      )}

      {/* Saved Filters Modal */}
      {showSavedFilters && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold text-gray-900">
                  Saved Filters
                </h2>
                <Button
                  variant="outline"
                  onClick={handleCloseSavedFilters}
                  className="p-2"
                >
                  <ApperIcon name="X" size={16} />
                </Button>
              </div>
              <SavedFilters
                type="contacts"
                onApply={handleApplyFilter}
              />
            </div>
          </div>
</div>
      )}

      {/* Export Dialog */}
      {showExportDialog && (
        <ExportDialog
          isOpen={showExportDialog}
          onClose={() => setShowExportDialog(false)}
          data={filteredContacts}
          dataType="contacts"
          title="Export Contacts"
        />
      )}
    </>
  );

};

export default Contacts;