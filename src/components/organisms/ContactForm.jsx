import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const ContactForm = ({ contact, onSave, onCancel, className }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || "",
    email: contact?.email || "",
    phone: contact?.phone || "",
    company: contact?.company || "",
    status: contact?.status || "new",
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
    
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      await onSave(formData);
      toast.success(contact ? "Contact updated successfully" : "Contact created successfully");
    } catch (error) {
      toast.error("Failed to save contact");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-lg border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {contact ? "Edit Contact" : "Add Contact"}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
          />
          
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
          />
          
          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
          
          <FormField
            label="Company"
            value={formData.company}
            onChange={(e) => handleChange("company", e.target.value)}
          />
          
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
          </FormField>
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
            {isSubmitting ? "Saving..." : "Save Contact"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;