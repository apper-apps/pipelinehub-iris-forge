import { toast } from "react-toastify";
    
    // Simulate API delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    export const contactService = {
      async getAll() {
        await delay(300);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            fields: [
              { field: { Name: "Name" } },
              { field: { Name: "email" } },
              { field: { Name: "phone" } },
              { field: { Name: "company" } },
              { field: { Name: "status" } },
              { field: { Name: "Tags" } },
              { field: { Name: "createdAt" } },
              { field: { Name: "lastActivity" } }
            ]
          };
          
          const response = await apperClient.fetchRecords('app_contact', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching contacts:", error);
          toast.error("Failed to load contacts");
          return [];
        }
      },
      
      async getById(id) {
        await delay(200);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            fields: [
              { field: { Name: "Name" } },
              { field: { Name: "email" } },
              { field: { Name: "phone" } },
              { field: { Name: "company" } },
              { field: { Name: "status" } },
              { field: { Name: "Tags" } },
              { field: { Name: "createdAt" } },
              { field: { Name: "lastActivity" } }
            ]
          };
          
          const response = await apperClient.getRecordById('app_contact', parseInt(id), params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return null;
          }
          
          return response.data;
        } catch (error) {
          console.error("Error fetching contact:", error);
          toast.error("Failed to load contact");
          return null;
        }
      },
      
      async create(contactData) {
        await delay(400);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          // Only include Updateable fields
          const params = {
            records: [{
              Name: contactData.name,
              email: contactData.email,
              phone: contactData.phone || "",
              company: contactData.company || "",
              status: contactData.status || "new",
              Tags: contactData.tags || "",
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString()
            }]
          };
          
          const response = await apperClient.createRecord('app_contact', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            throw new Error(response.message);
          }
          
          if (response.results) {
            const successfulRecords = response.results.filter(result => result.success);
            const failedRecords = response.results.filter(result => !result.success);
            
            if (failedRecords.length > 0) {
              console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
              failedRecords.forEach(record => {
                record.errors?.forEach(error => {
                  toast.error(`${error.fieldLabel}: ${error.message}`);
                });
                if (record.message) toast.error(record.message);
              });
            }
            
            if (successfulRecords.length > 0) {
              toast.success("Contact created successfully");
              return successfulRecords[0].data;
            }
          }
          
          throw new Error("Failed to create contact");
        } catch (error) {
          console.error("Error creating contact:", error);
          toast.error("Failed to create contact");
          throw error;
        }
      },
      
      async update(id, contactData) {
        await delay(350);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          // Only include Updateable fields
          const params = {
            records: [{
              Id: parseInt(id),
              Name: contactData.name,
              email: contactData.email,
              phone: contactData.phone || "",
              company: contactData.company || "",
              status: contactData.status,
              Tags: contactData.tags || "",
              lastActivity: new Date().toISOString()
            }]
          };
          
          const response = await apperClient.updateRecord('app_contact', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            throw new Error(response.message);
          }
          
          if (response.results) {
            const successfulUpdates = response.results.filter(result => result.success);
            const failedUpdates = response.results.filter(result => !result.success);
            
            if (failedUpdates.length > 0) {
              console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
              failedUpdates.forEach(record => {
                record.errors?.forEach(error => {
                  toast.error(`${error.fieldLabel}: ${error.message}`);
                });
                if (record.message) toast.error(record.message);
              });
            }
            
            if (successfulUpdates.length > 0) {
              toast.success("Contact updated successfully");
              return successfulUpdates[0].data;
            }
          }
          
          throw new Error("Failed to update contact");
        } catch (error) {
          console.error("Error updating contact:", error);
          toast.error("Failed to update contact");
          throw error;
        }
      },
      
      async delete(id) {
        await delay(250);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            RecordIds: [parseInt(id)]
          };
          
          const response = await apperClient.deleteRecord('app_contact', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            throw new Error(response.message);
          }
          
          if (response.results) {
            const successfulDeletions = response.results.filter(result => result.success);
            const failedDeletions = response.results.filter(result => !result.success);
            
            if (failedDeletions.length > 0) {
              console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
              failedDeletions.forEach(record => {
                if (record.message) toast.error(record.message);
              });
            }
            
            return successfulDeletions.length > 0;
          }
          
          return false;
        } catch (error) {
          console.error("Error deleting contact:", error);
          toast.error("Failed to delete contact");
          throw error;
        }
      },
      
      async search(query) {
        await delay(200);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            fields: [
              { field: { Name: "Name" } },
              { field: { Name: "email" } },
              { field: { Name: "phone" } },
              { field: { Name: "company" } },
              { field: { Name: "status" } },
              { field: { Name: "Tags" } }
            ],
            whereGroups: [{
              operator: "OR",
              subGroups: [{
                operator: "OR",
                conditions: [
                  { fieldName: "Name", operator: "Contains", values: [query] },
                  { fieldName: "email", operator: "Contains", values: [query] },
                  { fieldName: "company", operator: "Contains", values: [query] }
                ]
              }]
            }]
          };
          
          const response = await apperClient.fetchRecords('app_contact', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error searching contacts:", error);
          return [];
        }
      },
      
      async filterContacts(contacts, conditions) {
        await delay(250);
        
        // For now, implement client-side filtering
        // This can be moved to server-side with proper whereGroups implementation
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
      }
    };