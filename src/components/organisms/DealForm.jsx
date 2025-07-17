import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const DealForm = ({ deal, contacts, onSave, onCancel, className }) => {
  const [formData, setFormData] = useState({
    title: deal?.title || "",
    value: deal?.value || "",
    stage: deal?.stage || "prospecting",
    contactId: deal?.contactId || "",
    probability: deal?.probability || 50,
    closeDate: deal?.closeDate ? new Date(deal.closeDate).toISOString().split('T')[0] : "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!formData.value || formData.value <= 0) {
      toast.error("Value must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dealData = {
        ...formData,
        value: parseFloat(formData.value),
        probability: parseInt(formData.probability),
        closeDate: formData.closeDate ? new Date(formData.closeDate).toISOString() : new Date().toISOString(),
      };
      
      await onSave(dealData);
      toast.success(deal ? "Deal updated successfully" : "Deal created successfully");
    } catch (error) {
      toast.error("Failed to save deal");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-lg border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {deal ? "Edit Deal" : "Add Deal"}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
          
          <FormField
            label="Value"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange("value", e.target.value)}
            min="0"
            step="0.01"
            required
          />
          
          <FormField
            label="Stage"
            type="select"
            value={formData.stage}
            onChange={(e) => handleChange("stage", e.target.value)}
          >
            <option value="prospecting">Prospecting</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Closed Won</option>
            <option value="closed-lost">Closed Lost</option>
          </FormField>
          
          <FormField
            label="Contact"
            type="select"
            value={formData.contactId}
            onChange={(e) => handleChange("contactId", e.target.value)}
          >
            <option value="">Select a contact</option>
            {contacts.map(contact => (
              <option key={contact.Id} value={contact.Id}>
                {contact.name}
              </option>
            ))}
          </FormField>
          
          <FormField
            label="Probability (%)"
            type="number"
            value={formData.probability}
            onChange={(e) => handleChange("probability", e.target.value)}
            min="0"
            max="100"
          />
          
          <FormField
            label="Close Date"
            type="date"
            value={formData.closeDate}
            onChange={(e) => handleChange("closeDate", e.target.value)}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Deal"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default DealForm;