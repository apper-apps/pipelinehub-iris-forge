import { toast } from "react-toastify";
    
    // Simulate API delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    export const activityService = {
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
              { field: { Name: "type" } },
              { field: { Name: "description" } },
              { field: { Name: "contactId" } },
              { field: { Name: "timestamp" } },
              { field: { Name: "metadata" } },
              { field: { Name: "Tags" } }
            ],
            orderBy: [
              { fieldName: "timestamp", sorttype: "DESC" }
            ]
          };
          
          const response = await apperClient.fetchRecords('app_Activity', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching activities:", error);
          toast.error("Failed to load activities");
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
              { field: { Name: "type" } },
              { field: { Name: "description" } },
              { field: { Name: "contactId" } },
              { field: { Name: "timestamp" } },
              { field: { Name: "metadata" } },
              { field: { Name: "Tags" } }
            ]
          };
          
          const response = await apperClient.getRecordById('app_Activity', parseInt(id), params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return null;
          }
          
          return response.data;
        } catch (error) {
          console.error("Error fetching activity:", error);
          toast.error("Failed to load activity");
          return null;
        }
      },
      
      async create(activityData) {
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
              Name: activityData.description || activityData.type,
              type: activityData.type,
              description: activityData.description || "",
              contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
              timestamp: new Date().toISOString(),
              metadata: activityData.metadata || "",
              Tags: activityData.tags || ""
            }]
          };
          
          const response = await apperClient.createRecord('app_Activity', params);
          
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
              toast.success("Activity created successfully");
              return successfulRecords[0].data;
            }
          }
          
          throw new Error("Failed to create activity");
        } catch (error) {
          console.error("Error creating activity:", error);
          toast.error("Failed to create activity");
          throw error;
        }
      },
      
      async update(id, activityData) {
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
              Name: activityData.description || activityData.type,
              type: activityData.type,
              description: activityData.description || "",
              contactId: activityData.contactId ? parseInt(activityData.contactId) : null,
              timestamp: activityData.timestamp || new Date().toISOString(),
              metadata: activityData.metadata || "",
              Tags: activityData.tags || ""
            }]
          };
          
          const response = await apperClient.updateRecord('app_Activity', params);
          
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
              toast.success("Activity updated successfully");
              return successfulUpdates[0].data;
            }
          }
          
          throw new Error("Failed to update activity");
        } catch (error) {
          console.error("Error updating activity:", error);
          toast.error("Failed to update activity");
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
          
          const response = await apperClient.deleteRecord('app_Activity', params);
          
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
          console.error("Error deleting activity:", error);
          toast.error("Failed to delete activity");
          throw error;
        }
      },
      
      async getByContact(contactId) {
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
              { field: { Name: "type" } },
              { field: { Name: "description" } },
              { field: { Name: "contactId" } },
              { field: { Name: "timestamp" } },
              { field: { Name: "metadata" } }
            ],
            where: [{
              FieldName: "contactId",
              Operator: "EqualTo",
              Values: [parseInt(contactId)]
            }],
            orderBy: [
              { fieldName: "timestamp", sorttype: "DESC" }
            ]
          };
          
          const response = await apperClient.fetchRecords('app_Activity', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching activities by contact:", error);
          return [];
        }
      },
      
      async getByType(type) {
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
              { field: { Name: "type" } },
              { field: { Name: "description" } },
              { field: { Name: "contactId" } },
              { field: { Name: "timestamp" } },
              { field: { Name: "metadata" } }
            ],
            where: [{
              FieldName: "type",
              Operator: "EqualTo",
              Values: [type]
            }],
            orderBy: [
              { fieldName: "timestamp", sorttype: "DESC" }
            ]
          };
          
          const response = await apperClient.fetchRecords('app_Activity', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching activities by type:", error);
          return [];
        }
      },
      
      async getRecent(limit = 10) {
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
              { field: { Name: "type" } },
              { field: { Name: "description" } },
              { field: { Name: "contactId" } },
              { field: { Name: "timestamp" } },
              { field: { Name: "metadata" } }
            ],
            orderBy: [
              { fieldName: "timestamp", sorttype: "DESC" }
            ],
            pagingInfo: {
              limit: limit,
              offset: 0
            }
          };
          
          const response = await apperClient.fetchRecords('app_Activity', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching recent activities:", error);
          return [];
        }
      }
    };