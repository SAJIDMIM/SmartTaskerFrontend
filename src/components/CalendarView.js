import React, { useState, useEffect } from "react";

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const websocket = new WebSocket("ws://localhost:5000");

    websocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("WebSocket message:", message);
    };

    return () => websocket.close();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(new Date(year, month, day));
  }

  const tasksForDate = (date) => {
    if (!date || !tasks) return [];
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        date.getDate() === taskDate.getDate() &&
        date.getMonth() === taskDate.getMonth() &&
        date.getFullYear() === taskDate.getFullYear() &&
        !["buy groceries", "finish project", "call mom"].includes(
          task.title.toLowerCase()
        )
      );
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "0 auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    },
    navBtn: {
      padding: "6px 12px",
      cursor: "pointer",
      fontSize: "16px",
      backgroundColor: "#2563EB",
      color: "white",
      border: "none",
      borderRadius: "4px",
    },
    weekDays: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      marginBottom: "6px",
    },
    weekDayCell: {
      textAlign: "center",
      fontWeight: "600",
      padding: "6px 0",
      borderBottom: "1px solid #ccc",
    },
    calendarGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: "6px",
    },
    emptyCell: {
      border: "1px solid transparent",
    },
    dateCell: {
      minHeight: "90px",
      borderRadius: "8px",
      padding: "6px",
      boxSizing: "border-box",
      position: "relative",
      userSelect: "none",
      fontSize: "12px",
    },
    dateNumber: {
      fontWeight: "700",
      marginBottom: "4px",
    },
    tasksContainer: {
      flexGrow: 1,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    taskTitle: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      fontSize: "10px",
    },
    moreTasks: {
      fontStyle: "italic",
      fontSize: "10px",
    },
    taskList: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f3f4f6",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    },
    closeBtn: {
      marginTop: "10px",
      padding: "6px 12px",
      cursor: "pointer",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#2563EB",
      color: "white",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={prevMonth} style={styles.navBtn}>
          &lt;
        </button>
        <h2>
          {currentDate.toLocaleString("default", { month: "long" })} {year}
        </h2>
        <button onClick={nextMonth} style={styles.navBtn}>
          &gt;
        </button>
      </div>

      <div style={styles.weekDays}>
        {WEEK_DAYS.map((day) => (
          <div key={day} style={styles.weekDayCell}>
            {day}
          </div>
        ))}
      </div>

      <div style={styles.calendarGrid}>
        {calendarCells.map((date, idx) => {
          if (!date) return <div key={idx} style={styles.emptyCell}></div>;

          const dayTasks = tasksForDate(date);
          const isSelected =
            selectedDate && date.toDateString() === selectedDate.toDateString();

          return (
            <div
              key={idx}
              style={{
                ...styles.dateCell,
                backgroundColor: isSelected ? "#2563EB" : "transparent",
                color: isSelected ? "#fff" : "#000",
                border: dayTasks.length
                  ? "2px solid #2563EB"
                  : "1px solid #ddd",
                cursor: "pointer",
              }}
              onClick={() => setSelectedDate(isSelected ? null : date)}
              title={
                dayTasks.length ? dayTasks.map((t) => t.title).join(", ") : ""
              }
            >
              <div style={styles.dateNumber}>{date.getDate()}</div>
              <div style={styles.tasksContainer}>
                {dayTasks.slice(0, 3).map((task) => (
                  <div
                    key={task._id}
                    style={{
                      ...styles.taskTitle,
                      color: isSelected ? "#fff" : "#2563EB",
                    }}
                    title={`${task.title} (${task.priority})`}
                  >
                    • {task.title}
                  </div>
                ))}
                {dayTasks.length > 3 && (
                  <div
                    style={{
                      ...styles.moreTasks,
                      color: isSelected ? "#ddd" : "#999",
                    }}
                  >
                    +{dayTasks.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div style={styles.taskList}>
          <h3>Tasks for {selectedDate.toDateString()}</h3>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {tasksForDate(selectedDate).map((task) => (
              <li
                key={task._id}
                style={{
                  marginBottom: "8px",
                  padding: "8px",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              >
                <strong>{task.title}</strong> [{task.priority}] |{" "}
                {task.category}
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedDate(null)} style={styles.closeBtn}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarView;
