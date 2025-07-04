import React, { useState, useEffect } from "react";
import Tasks from "./Tasks";
import DeadlineReminder from "./DeadlineReminder";
import axios from "axios";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios
      .get("https://smarttaskerbackend-production.up.railway.app/api/tasks")
      .then((res) => setTasks(res.data))
      .catch((err) => console.error("Failed to load tasks:", err));
  }, []);

  return (
    <div>
      <h2>SmartTasker</h2>
      <Tasks tasks={tasks} setTasks={setTasks} />
      <h3 style={{ marginTop: "30px" }}>Deadline Reminders</h3>
      <DeadlineReminder tasks={tasks} />
    </div>
  );
};

export default TaskManager;
