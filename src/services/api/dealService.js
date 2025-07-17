import { toast } from "react-toastify";
    
    // Simulate API delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    export const dealService = {
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
              { field: { Name: "title" } },
              { field: { Name: "value" } },
              { field: { Name: "stage" } },
              { field: { Name: "probability" } },
              { field: { Name: "closeDate" } },
              { field: { Name: "createdAt" } },
              { field: { Name: "contactId" } },
              { field: { Name: "Tags" } }
            ]
          };
          
          const response = await apperClient.fetchRecords('deal', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching deals:", error);
          toast.error("Failed to load deals");
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
              { field: { Name: "title" } },
              { field: { Name: "value" } },
              { field: { Name: "stage" } },
              { field: { Name: "probability" } },
              { field: { Name: "closeDate" } },
              { field: { Name: "createdAt" } },
              { field: { Name: "contactId" } },
              { field: { Name: "Tags" } }
            ]
          };
          
          const response = await apperClient.getRecordById('deal', parseInt(id), params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return null;
          }
          
          return response.data;
        } catch (error) {
          console.error("Error fetching deal:", error);
          toast.error("Failed to load deal");
          return null;
        }
      },
      
      async create(dealData) {
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
              Name: dealData.title,
              title: dealData.title,
              value: parseFloat(dealData.value),
              stage: dealData.stage || "prospecting",
              probability: parseInt(dealData.probability) || 50,
              closeDate: dealData.closeDate || new Date().toISOString(),
              createdAt: new Date().toISOString(),
              contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
              Tags: dealData.tags || ""
            }]
          };
          
          const response = await apperClient.createRecord('deal', params);
          
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
              toast.success("Deal created successfully");
              return successfulRecords[0].data;
            }
          }
          
          throw new Error("Failed to create deal");
        } catch (error) {
          console.error("Error creating deal:", error);
          toast.error("Failed to create deal");
          throw error;
        }
      },
      
      async update(id, dealData) {
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
              Name: dealData.title,
              title: dealData.title,
              value: parseFloat(dealData.value),
              stage: dealData.stage,
              probability: parseInt(dealData.probability),
              closeDate: dealData.closeDate,
              contactId: dealData.contactId ? parseInt(dealData.contactId) : null,
              Tags: dealData.tags || ""
            }]
          };
          
          const response = await apperClient.updateRecord('deal', params);
          
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
              toast.success("Deal updated successfully");
              return successfulUpdates[0].data;
            }
          }
          
          throw new Error("Failed to update deal");
        } catch (error) {
          console.error("Error updating deal:", error);
          toast.error("Failed to update deal");
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
          
          const response = await apperClient.deleteRecord('deal', params);
          
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
          console.error("Error deleting deal:", error);
          toast.error("Failed to delete deal");
          throw error;
        }
      },
      
      async updateStage(id, newStage) {
        await delay(200);
        
        try {
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            records: [{
              Id: parseInt(id),
              stage: newStage
            }]
          };
          
          const response = await apperClient.updateRecord('deal', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            throw new Error(response.message);
          }
          
          if (response.results && response.results.length > 0 && response.results[0].success) {
            return response.results[0].data;
          }
          
          throw new Error("Failed to update deal stage");
        } catch (error) {
          console.error("Error updating deal stage:", error);
          toast.error("Failed to update deal stage");
          throw error;
        }
      },
      
      async getByStage(stage) {
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
              { field: { Name: "title" } },
              { field: { Name: "value" } },
              { field: { Name: "stage" } },
              { field: { Name: "probability" } },
              { field: { Name: "closeDate" } },
              { field: { Name: "contactId" } }
            ],
            where: [{
              FieldName: "stage",
              Operator: "EqualTo",
              Values: [stage]
            }]
          };
          
          const response = await apperClient.fetchRecords('deal', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching deals by stage:", error);
          return [];
        }
      },
      
      async filterDeals(deals, conditions) {
        await delay(250);
        
        // For now, implement client-side filtering
        // This can be moved to server-side with proper whereGroups implementation
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
      }
    };