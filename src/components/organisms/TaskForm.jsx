import React, { useState } from "react";
import { cn } from "@/utils/cn";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import { toast } from "react-toastify";

const TaskForm = ({ task, contacts, onSave, onCancel, className }) => {
  const [formData, setFormData] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
    status: task?.status || "pending",
    contactId: task?.contactId || "",
    assignedTo: task?.assignedTo || "",
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

    if (!formData.dueDate) {
      toast.error("Due date is required");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const taskData = {
        ...formData,
        dueDate: new Date(formData.dueDate).toISOString(),
      };
      
      await onSave(taskData);
      toast.success(task ? "Task updated successfully" : "Task created successfully");
    } catch (error) {
      toast.error("Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow-lg border border-gray-200", className)}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {task ? "Edit Task" : "Add Task"}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="md:col-span-2"
          />
          
          <FormField
            label="Description"
            type="textarea"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
            className="md:col-span-2"
          />
          
          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleChange("dueDate", e.target.value)}
            required
          />
          
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
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
            label="Assigned To"
            value={formData.assignedTo}
            onChange={(e) => handleChange("assignedTo", e.target.value)}
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
            {isSubmitting ? "Saving..." : "Save Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;