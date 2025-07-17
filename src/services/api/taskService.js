import { toast } from "react-toastify";
    
    // Simulate API delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    export const taskService = {
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
              { field: { Name: "description" } },
              { field: { Name: "dueDate" } },
              { field: { Name: "status" } },
              { field: { Name: "contactId" } },
              { field: { Name: "assignedTo" } },
              { field: { Name: "Tags" } }
            ]
          };
          
          const response = await apperClient.fetchRecords('task', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching tasks:", error);
          toast.error("Failed to load tasks");
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
              { field: { Name: "description" } },
              { field: { Name: "dueDate" } },
              { field: { Name: "status" } },
              { field: { Name: "contactId" } },
              { field: { Name: "assignedTo" } },
              { field: { Name: "Tags" } }
            ]
          };
          
          const response = await apperClient.getRecordById('task', parseInt(id), params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            return null;
          }
          
          return response.data;
        } catch (error) {
          console.error("Error fetching task:", error);
          toast.error("Failed to load task");
          return null;
        }
      },
      
      async create(taskData) {
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
              Name: taskData.title,
              title: taskData.title,
              description: taskData.description || "",
              dueDate: taskData.dueDate,
              status: taskData.status || "pending",
              contactId: taskData.contactId ? parseInt(taskData.contactId) : null,
              assignedTo: taskData.assignedTo || "",
              Tags: taskData.tags || ""
            }]
          };
          
          const response = await apperClient.createRecord('task', params);
          
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
              toast.success("Task created successfully");
              return successfulRecords[0].data;
            }
          }
          
          throw new Error("Failed to create task");
        } catch (error) {
          console.error("Error creating task:", error);
          toast.error("Failed to create task");
          throw error;
        }
      },
      
      async update(id, taskData) {
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
              Name: taskData.title,
              title: taskData.title,
              description: taskData.description || "",
              dueDate: taskData.dueDate,
              status: taskData.status,
              contactId: taskData.contactId ? parseInt(taskData.contactId) : null,
              assignedTo: taskData.assignedTo || "",
              Tags: taskData.tags || ""
            }]
          };
          
          const response = await apperClient.updateRecord('task', params);
          
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
              toast.success("Task updated successfully");
              return successfulUpdates[0].data;
            }
          }
          
          throw new Error("Failed to update task");
        } catch (error) {
          console.error("Error updating task:", error);
          toast.error("Failed to update task");
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
          
          const response = await apperClient.deleteRecord('task', params);
          
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
          console.error("Error deleting task:", error);
          toast.error("Failed to delete task");
          throw error;
        }
      },
      
      async toggleComplete(id) {
        await delay(200);
        
        try {
          // First get the current task
          const currentTask = await this.getById(id);
          if (!currentTask) {
            throw new Error("Task not found");
          }
          
          const newStatus = currentTask.status === "completed" ? "pending" : "completed";
          
          const { ApperClient } = window.ApperSDK;
          const apperClient = new ApperClient({
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
          });
          
          const params = {
            records: [{
              Id: parseInt(id),
              status: newStatus
            }]
          };
          
          const response = await apperClient.updateRecord('task', params);
          
          if (!response.success) {
            console.error(response.message);
            toast.error(response.message);
            throw new Error(response.message);
          }
          
          if (response.results && response.results.length > 0 && response.results[0].success) {
            return response.results[0].data;
          }
          
          throw new Error("Failed to toggle task completion");
        } catch (error) {
          console.error("Error toggling task completion:", error);
          toast.error("Failed to update task");
          throw error;
        }
      },
      
      async getByStatus(status) {
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
              { field: { Name: "description" } },
              { field: { Name: "dueDate" } },
              { field: { Name: "status" } },
              { field: { Name: "contactId" } },
              { field: { Name: "assignedTo" } }
            ],
            where: [{
              FieldName: "status",
              Operator: "EqualTo",
              Values: [status]
            }]
          };
          
          const response = await apperClient.fetchRecords('task', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching tasks by status:", error);
          return [];
        }
      },
      
      async getOverdue() {
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
              { field: { Name: "description" } },
              { field: { Name: "dueDate" } },
              { field: { Name: "status" } },
              { field: { Name: "contactId" } },
              { field: { Name: "assignedTo" } }
            ],
            whereGroups: [{
              operator: "AND",
              subGroups: [{
                operator: "AND",
                conditions: [
                  { fieldName: "status", operator: "NotEqualTo", values: ["completed"] },
                  { fieldName: "dueDate", operator: "LessThan", values: [new Date().toISOString()] }
                ]
              }]
            }]
          };
          
          const response = await apperClient.fetchRecords('task', params);
          
          if (!response.success) {
            console.error(response.message);
            return [];
          }
          
          return response.data || [];
        } catch (error) {
          console.error("Error fetching overdue tasks:", error);
          return [];
        }
      }
    };