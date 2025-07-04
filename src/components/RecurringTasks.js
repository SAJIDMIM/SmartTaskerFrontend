import React, { useState } from "react";
import axios from "axios"; // Make sure to install axios via npm or yarn

const recurrenceOptions = ["Daily", "Weekly", "Monthly"];

const RecurringTasks = ({ tasks, recurringTasks, setRecurringTasks }) => {
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [recurrence, setRecurrence] = useState("Daily");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddRecurring = async () => {
    if (!selectedTaskId) return;
    setError(null);
    setLoading(true);

    try {
      const task = tasks.find((t) => t._id === selectedTaskId);
      if (!task) throw new Error("Task not found");

      // Prepare data for backend
      const payload = {
        title: task.title,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate,
        recurrence: recurrence,
      };

      // Send to backend
      const response = await axios.post(
        "https://smarttaskerbackend-production.up.railway.app/api/tasks",
        payload
      );

      // On success, add to recurringTasks state
      setRecurringTasks([
        ...recurringTasks,
        {
          taskId: response.data._id,
          title: response.data.title,
          recurrence: response.data.recurrence,
        },
      ]);

      // Reset selections
      setSelectedTaskId("");
      setRecurrence("Daily");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to add recurring task"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>♻️ Recurring Tasks</h2>
      <p style={styles.description}>
        Set tasks to repeat daily, weekly, or monthly to reduce manual re-entry.
      </p>

      <div style={styles.formRow}>
        <select
          style={styles.select}
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
        >
          <option value="">Select Task...</option>
          {tasks.map((task) => (
            <option key={task._id} value={task._id}>
              {task.title} [{task.category}]
            </option>
          ))}
        </select>

        <select
          style={{ ...styles.select, marginLeft: 10 }}
          value={recurrence}
          onChange={(e) => setRecurrence(e.target.value)}
        >
          {recurrenceOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          style={styles.addButton}
          onClick={handleAddRecurring}
          disabled={!selectedTaskId || loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {recurringTasks.length === 0 ? (
        <p style={styles.noTasks}>No recurring tasks set yet.</p>
      ) : (
        <ul style={styles.list}>
          {recurringTasks.map(({ taskId, title, recurrence }) => (
            <li key={taskId} style={styles.listItem}>
              <span>
                {title} - <em>{recurrence}</em>
              </span>
              <button
                onClick={() =>
                  setRecurringTasks(
                    recurringTasks.filter((rt) => rt.taskId !== taskId)
                  )
                }
                style={styles.removeButton}
                aria-label={`Remove recurring task ${title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "var(--content-bg, #fff)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    maxWidth: 600,
    margin: "0 auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: {
    fontSize: 24,
    marginBottom: 6,
    fontWeight: "700",
  },
  description: {
    fontSize: 14,
    marginBottom: 20,
    color: "#666",
  },
  formRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 20,
  },
  select: {
    flex: 1,
    padding: "8px 12px",
    fontSize: 16,
    borderRadius: 8,
    border: "1px solid #ccc",
    outline: "none",
  },
  addButton: {
    marginLeft: 12,
    padding: "8px 16px",
    backgroundColor: "#2563EB",
    color: "white",
    fontWeight: "600",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    userSelect: "none",
  },
  noTasks: {
    color: "#999",
    fontStyle: "italic",
    textAlign: "center",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px 12px",
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    marginBottom: 10,
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ef4444",
    border: "none",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
    padding: "2px 8px",
    fontWeight: "700",
    userSelect: "none",
  },
};

export default RecurringTasks;
