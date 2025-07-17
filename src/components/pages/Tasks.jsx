import React, { useState, useEffect } from "react";
import TaskList from "@/components/organisms/TaskList";
import TaskForm from "@/components/organisms/TaskForm";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { contactService } from "@/services/api/contactService";
import { toast } from "react-toastify";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const [view, setView] = useState("list");

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const [tasksData, contactsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
    } catch (err) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

const handleSaveTask = async (taskData) => {
    if (editingTask) {
      const updatedTask = await taskService.update(editingTask.Id, taskData);
      setTasks(prev => prev.map(t => t.Id === updatedTask.Id ? updatedTask : t));
    } else {
      const newTask = await taskService.create(taskData);
      setTasks(prev => [...prev, newTask]);
    }
    setShowForm(false);
    setEditingTask(null);
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const updatedTask = await taskService.toggleComplete(taskId);
      setTasks(prev => prev.map(t => t.Id === taskId ? updatedTask : t));
      toast.success("Task updated successfully");
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(prev => prev.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error("Failed to delete task");
      }
    }
  };

  const getFilteredTasks = () => {
    switch (filter) {
      case "pending":
        return tasks.filter(task => task.status === "pending");
      case "completed":
        return tasks.filter(task => task.status === "completed");
      case "overdue":
        return tasks.filter(task => 
          task.status === "pending" && new Date(task.dueDate) < new Date()
        );
      default:
        return tasks;
    }
  };

  const getTaskCounts = () => {
    const pending = tasks.filter(task => task.status === "pending").length;
    const completed = tasks.filter(task => task.status === "completed").length;
    const overdue = tasks.filter(task => 
      task.status === "pending" && new Date(task.dueDate) < new Date()
    ).length;
    
    return { pending, completed, overdue, total: tasks.length };
  };

  if (loading) {
    return <Loading type="table" />;
  }

  if (error) {
    return (
      <Error
        title="Tasks Error"
        message={error}
        onRetry={loadTasks}
      />
    );
  }

  if (showForm) {
    return (
      <TaskForm
        task={editingTask}
        contacts={contacts}
        onSave={handleSaveTask}
        onCancel={() => {
          setShowForm(false);
          setEditingTask(null);
        }}
      />
    );
  }

  const filteredTasks = getFilteredTasks();
  const taskCounts = getTaskCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 mt-1">
            {taskCounts.pending} pending, {taskCounts.completed} completed
            {taskCounts.overdue > 0 && (
              <span className="text-error font-medium ml-2">
                ({taskCounts.overdue} overdue)
              </span>
            )}
          </p>
        </div>
        <Button onClick={handleAddTask}>
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Task
        </Button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={filter === "all" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({taskCounts.total})
          </Button>
          <Button
            variant={filter === "pending" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("pending")}
          >
            Pending ({taskCounts.pending})
          </Button>
          <Button
            variant={filter === "completed" ? "primary" : "outline"}
            size="sm"
            onClick={() => setFilter("completed")}
          >
            Completed ({taskCounts.completed})
          </Button>
          {taskCounts.overdue > 0 && (
            <Button
              variant={filter === "overdue" ? "danger" : "outline"}
              size="sm"
              onClick={() => setFilter("overdue")}
            >
              Overdue ({taskCounts.overdue})
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant={view === "list" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            <ApperIcon name="List" size={16} />
          </Button>
          <Button
            variant={view === "calendar" ? "primary" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            <ApperIcon name="Calendar" size={16} />
          </Button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty
          title="No tasks found"
          message={filter === "all" ? "Get started by adding your first task." : `No ${filter} tasks found.`}
          icon="CheckSquare"
          actionLabel="Add Task"
          onAction={handleAddTask}
        />
      ) : (
        <TaskList
          tasks={filteredTasks}
          onToggleComplete={handleToggleComplete}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />
      )}
    </div>
  );
};

export default Tasks;