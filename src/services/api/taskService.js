import tasksData from "@/services/mockData/tasks.json";

let tasks = [...tasksData];

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const taskService = {
  async getAll() {
    await delay(300);
    return [...tasks];
  },

  async getById(id) {
    await delay(200);
    const task = tasks.find(t => t.Id === parseInt(id));
    if (!task) {
      throw new Error("Task not found");
    }
    return { ...task };
  },

  async create(taskData) {
    await delay(400);
    const newTask = {
      ...taskData,
      Id: Math.max(...tasks.map(t => t.Id)) + 1,
      createdAt: new Date().toISOString(),
    };
    tasks.push(newTask);
    return { ...newTask };
  },

  async update(id, taskData) {
    await delay(350);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    const updatedTask = {
      ...tasks[index],
      ...taskData,
      Id: parseInt(id),
    };
    
    tasks[index] = updatedTask;
    return { ...updatedTask };
  },

  async delete(id) {
    await delay(250);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks.splice(index, 1);
    return { success: true };
  },

  async toggleComplete(id) {
    await delay(200);
    const index = tasks.findIndex(t => t.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Task not found");
    }
    
    tasks[index].status = tasks[index].status === "completed" ? "pending" : "completed";
    return { ...tasks[index] };
  },

  async getByStatus(status) {
    await delay(200);
    return tasks.filter(task => task.status === status);
  },

  async getOverdue() {
    await delay(200);
    const now = new Date();
    return tasks.filter(task => 
      task.status !== "completed" && 
      new Date(task.dueDate) < now
    );
  },
};