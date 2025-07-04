import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import axios from "axios";

const Tasks = ({ tasks, setTasks }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    priority: "Medium",
    category: "General",
    dueDate: new Date().toISOString().slice(0, 10),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);

  // No need to fetch tasks here since tasks come from parent

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    if (!newTask.dueDate) return alert("Please select a due date");

    try {
      // Call backend API to add task and get saved task with _id
      const response = await fetch("https://smarttaskerbackend-production.up.railway.app/api/logintasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      if (!response.ok) {
        const errData = await response.json();
        alert(
          "Failed to add task: " + (errData.message || response.statusText)
        );
        return;
      }

      const savedTask = await response.json();

      // Update tasks in parent
      setTasks([...tasks, savedTask]);

      setNewTask({
        title: "",
        priority: "Medium",
        category: "General",
        dueDate: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      alert("Error adding task: " + error.message);
    }
  };
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`https://smarttaskerbackend-production.up.railway.app/api/tasks/${_id}`);
      setTasks((prev) => prev.filter((task) => task._id !== _id));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleEdit = (task) => {
    setEditId(task._id);
    setNewTask({
      title: task.title,
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate
        ? task.dueDate.slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    });
  };

  const handleUpdate = async () => {
    if (!newTask.title.trim()) return;
    if (!newTask.dueDate) return alert("Please select a due date");

    try {
      const response = await fetch(
        `https://smarttaskerbackend-production.up.railway.app/api/login/tasks/${editId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        alert(
          "Failed to update task: " + (errData.message || response.statusText)
        );
        return;
      }

      const updatedTask = await response.json();

      setTasks(tasks.map((task) => (task._id === editId ? updatedTask : task)));

      setEditId(null);
      setNewTask({
        title: "",
        priority: "Medium",
        category: "General",
        dueDate: new Date().toISOString().slice(0, 10),
      });
    } catch (error) {
      alert("Error updating task: " + error.message);
    }
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <div style={styles.searchAddWrapper}>
        <div style={styles.searchBox}>
          <FaSearch style={styles.icon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
        </div>

        <div style={styles.form}>
          <input
            type="text"
            placeholder="Task title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={styles.input}
          />
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            style={styles.select}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            value={newTask.category}
            onChange={(e) =>
              setNewTask({ ...newTask, category: e.target.value })
            }
            style={styles.input}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
            style={{ ...styles.input, maxWidth: "160px" }}
          />
          <button
            onClick={editId ? handleUpdate : handleAddTask}
            style={styles.button}
          >
            {editId ? (
              "Update"
            ) : (
              <>
                <FaPlus /> Add
              </>
            )}
          </button>
        </div>
      </div>

      <div style={styles.taskList}>
        {filteredTasks.length === 0 ? (
          <p>No tasks found.</p>
        ) : (
          filteredTasks.map((task) => (
            <div key={task._id} style={styles.taskItem}>
              <div>
                <strong>{task.title}</strong>
                <p style={styles.meta}>
                  [{task.priority}] | {task.category} | Due:{" "}
                  {new Date(task.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div>
                <button onClick={() => handleEdit(task)} style={styles.iconBtn}>
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  style={styles.iconBtn}
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
  },
  searchAddWrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    marginBottom: "20px",
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: "1 1 150px",
  },
  select: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    flex: "0 0 120px",
  },
  button: {
    backgroundColor: "#4f46e5",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontWeight: "600",
  },
  taskList: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  taskItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 10px",
    borderBottom: "1px solid #eee",
    alignItems: "center",
  },
  meta: {
    fontSize: "12px",
    color: "#555",
    margin: 0,
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    marginLeft: "10px",
  },
  icon: {
    fontSize: "18px",
    color: "#555",
  },
};

export default Tasks;
