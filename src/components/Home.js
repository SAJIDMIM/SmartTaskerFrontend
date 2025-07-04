import React, { useState } from "react";
import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaRedoAlt,
  FaBell,
  FaComments,
  FaSignOutAlt,
  FaMoon,
  FaSun,
} from "react-icons/fa";
import logo from "../assets/logo.jpg";
import Tasks from "./Tasks";
import CalendarView from "./CalendarView";
import RecurringTasks from "./RecurringTasks";
import Chat from "./Chat";

const menuItems = [
  { id: "home", label: "Home", icon: <FaHome /> },
  { id: "tasks", label: "Tasks (CRUD)", icon: <FaTasks /> },
  { id: "calendar", label: "Calendar View", icon: <FaCalendarAlt /> },
  { id: "recurring", label: "Recurring Tasks", icon: <FaRedoAlt /> },
  { id: "deadline", label: "Deadline Reminder", icon: <FaBell /> },
  { id: "openchat", label: "OpenChat", icon: <FaComments /> },
  { id: "logout", label: "Logout", icon: <FaSignOutAlt /> },
];

const Dashboard = () => {
  const [active, setActive] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fadeIn, setFadeIn] = useState(true);

  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Finish project",
      priority: "High",
      category: "Work",
      dueDate: "2025-07-05",
    },
    {
      id: 2,
      title: "Buy groceries",
      priority: "Medium",
      category: "Personal",
      dueDate: "2025-07-06",
    },
    {
      id: 3,
      title: "Call mom",
      priority: "Low",
      category: "Personal",
      dueDate: "2025-07-05",
    },
  ]);

  const [recurringTasks, setRecurringTasks] = useState([]);

  const handleMenuClick = (id) => {
    if (id === "logout") {
      alert("Logging out...");
    } else {
      setFadeIn(false);
      setTimeout(() => {
        setActive(id);
        setFadeIn(true);
      }, 100);
    }
  };

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);
  const currentStyles = isDarkMode ? darkStyles : lightStyles;

  // Deadline Reminder Component (inside Dashboard)
  const DeadlineReminder = () => {
    const today = new Date().toISOString().slice(0, 10);
    const upcomingTasks = tasks
      .filter((task) => task.dueDate >= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    if (upcomingTasks.length === 0) {
      return (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No upcoming deadlines.
        </p>
      );
    }

    const priorityColors = {
      High: "#dc2626",
      Medium: "#d97706",
      Low: "#2563eb",
    };

    return (
      <div style={currentStyles.deadlineContainer}>
        {upcomingTasks.map((task) => (
          <div
            key={task.id}
            style={{
              ...currentStyles.deadlineCard,
              borderColor: priorityColors[task.priority],
            }}
          >
            <h3 style={currentStyles.taskTitle}>{task.title}</h3>
            <p>
              <strong>Due:</strong>{" "}
              {new Date(task.dueDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Priority:</strong>{" "}
              <span
                style={{
                  color: priorityColors[task.priority],
                  fontWeight: "700",
                }}
              >
                {task.priority}
              </span>
            </p>
            <p>
              <strong>Category:</strong> {task.category}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // Home Overview component
  const HomeOverview = ({ isDarkMode, tasks, recurringTasks }) => {
    const today = new Date().toISOString().slice(0, 10);

    const scheduledTasks = tasks.filter((task) => task.dueDate >= today);

    const deadlineWindowEnd = new Date();
    deadlineWindowEnd.setDate(deadlineWindowEnd.getDate() + 2);
    const deadlineEndStr = deadlineWindowEnd.toISOString().slice(0, 10);
    const deadlineTasks = tasks.filter(
      (task) => task.dueDate >= today && task.dueDate <= deadlineEndStr
    );

    const recurringPreview = recurringTasks.slice(0, 3);

    const highPriorityTasks = tasks.filter((task) => task.priority === "High");

    const boxStyle = {
      backgroundColor: isDarkMode ? "#1e1e2f" : "#fff",
      borderRadius: 12,
      padding: 20,
      boxShadow: isDarkMode
        ? "0 4px 12px rgba(0,0,0,0.8)"
        : "0 4px 12px rgba(0,0,0,0.1)",
      color: isDarkMode ? "#eee" : "#222",
      display: "flex",
      flexDirection: "column",
      gap: 12,
    };

    const listItemStyle = {
      fontSize: 14,
      color: isDarkMode ? "#bbb" : "#555",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    };

    return (
      <div
        style={{
          display: "grid",
          gap: 24,
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        }}
      >
        {/* Scheduled Tasks */}
        <div style={boxStyle}>
          <h3 style={{ margin: 0, fontWeight: "700" }}>Scheduled Tasks</h3>
          <p style={{ margin: 0, fontSize: 24, color: "#4f46e5" }}>
            {scheduledTasks.length}
          </p>
          {scheduledTasks.length === 0 && (
            <p style={{ fontStyle: "italic" }}>No scheduled tasks</p>
          )}
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {scheduledTasks.slice(0, 3).map((task) => (
              <li key={task.id} style={listItemStyle}>
                {task.title} - {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        {/* Deadline Reminders */}
        <div style={boxStyle}>
          <h3 style={{ margin: 0, fontWeight: "700" }}>Deadline Reminders</h3>
          <p style={{ margin: 0, fontSize: 24, color: "#dc2626" }}>
            {deadlineTasks.length}
          </p>
          {deadlineTasks.length === 0 && (
            <p style={{ fontStyle: "italic" }}>No upcoming deadlines</p>
          )}
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {deadlineTasks.slice(0, 3).map((task) => (
              <li key={task.id} style={listItemStyle}>
                {task.title} - Due {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>

        {/* Recurring Tasks */}
        <div style={boxStyle}>
          <h3 style={{ margin: 0, fontWeight: "700" }}>Recurring Tasks</h3>
          <p style={{ margin: 0, fontSize: 24, color: "#059669" }}>
            {recurringTasks.length}
          </p>
          {recurringTasks.length === 0 && (
            <p style={{ fontStyle: "italic" }}>No recurring tasks</p>
          )}
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {recurringPreview.length === 0
              ? null
              : recurringPreview.map((task, i) => (
                  <li key={i} style={listItemStyle}>
                    {task.title} - {task.frequency || "N/A"}
                  </li>
                ))}
          </ul>
        </div>

        {/* Priority Tasks (High) */}
        <div style={boxStyle}>
          <h3 style={{ margin: 0, fontWeight: "700" }}>High Priority Tasks</h3>
          <p style={{ margin: 0, fontSize: 24, color: "#b91c1c" }}>
            {highPriorityTasks.length}
          </p>
          {highPriorityTasks.length === 0 && (
            <p style={{ fontStyle: "italic" }}>No high priority tasks</p>
          )}
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {highPriorityTasks.slice(0, 3).map((task) => (
              <li key={task.id} style={listItemStyle}>
                {task.title} - Due {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div style={currentStyles.container}>
      {/* Sidebar */}
      <nav style={currentStyles.sidebar}>
        <div style={currentStyles.sidebarHeader}>
          <div style={currentStyles.logoContainer}>
            <img src={logo} alt="Logo" style={currentStyles.logoImage} />
            <h2 style={currentStyles.logoText}>SmartTasker</h2>
          </div>
          <button
            onClick={toggleDarkMode}
            aria-label="Toggle Dark Mode"
            style={{
              ...currentStyles.darkModeToggle,
              transform: isDarkMode ? "rotate(360deg)" : "rotate(0deg)",
              transition: "transform 0.5s ease",
            }}
          >
            {isDarkMode ? <FaSun /> : <FaMoon />}
          </button>
        </div>

        <ul style={currentStyles.menuList}>
          {menuItems.map((item) => (
            <li
              key={item.id}
              style={{
                ...currentStyles.menuItem,
                ...(active === item.id ? currentStyles.menuItemActive : {}),
              }}
              onClick={() => handleMenuClick(item.id)}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.05)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform =
                  active === item.id ? "scale(1.02)" : "scale(1.0)")
              }
            >
              <span style={currentStyles.icon}>{item.icon}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ul>
      </nav>

      {/* Main Content */}
      <main style={currentStyles.mainContent}>
        <header style={currentStyles.header}>
          <h1 style={currentStyles.title}>Welcome to SmartTasker Dashboard</h1>
          <p style={currentStyles.subtitle}>
            Manage your tasks and boost your productivity!
          </p>
        </header>

        <section
          style={{
            ...currentStyles.content,
            opacity: fadeIn ? 1 : 0,
            transition: "opacity 0.5s ease-in-out",
          }}
        >
          {active === "home" && (
            <HomeOverview
              isDarkMode={isDarkMode}
              tasks={tasks}
              recurringTasks={recurringTasks}
            />
          )}

          {active === "tasks" && <Tasks tasks={tasks} setTasks={setTasks} />}

          {active === "calendar" && <CalendarView tasks={tasks} />}

          {active === "recurring" && (
            <RecurringTasks
              tasks={tasks}
              recurringTasks={recurringTasks}
              setRecurringTasks={setRecurringTasks}
            />
          )}

          {active === "deadline" && <DeadlineReminder />}

          {active === "openchat" && <Chat />}

          {active === "logout" && <p>Logging out...</p>}
        </section>
      </main>
    </div>
  );
};

// Styles (unchanged from your original code)

const baseStyles = {
  container: {
    display: "flex",
    height: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  sidebar: {
    width: "240px",
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    borderTopRightRadius: "30px",
    borderBottomRightRadius: "30px",
    boxShadow: "5px 0 15px rgba(0, 0, 0, 0.1)",
  },
  sidebarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoImage: {
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  logoText: {
    fontSize: "22px",
    fontWeight: "bold",
    letterSpacing: "1px",
  },
  darkModeToggle: {
    background: "transparent",
    border: "none",
    color: "inherit",
    cursor: "pointer",
    fontSize: "22px",
  },
  menuList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    flexGrow: 1,
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 15px",
    borderRadius: "10px",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "16px",
    transition: "all 0.25s ease-in-out",
    marginBottom: "10px",
  },
  menuItemActive: {
    fontWeight: "700",
    transform: "scale(1.02)",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  },
  icon: {
    fontSize: "18px",
  },
  mainContent: {
    flexGrow: 1,
    padding: "40px",
    overflowY: "auto",
  },
  header: {
    marginBottom: "30px",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "16px",
  },
  content: {
    fontSize: "18px",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  },

  deadlineContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  deadlineCard: {
    border: "3px solid",
    borderRadius: "12px",
    padding: "15px",
    backgroundColor: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
    color: "#111",
  },
  taskTitle: {
    margin: "0 0 10px",
  },
};

const lightStyles = {
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: "#f0f2f5",
    color: "#333",
  },
  sidebar: {
    ...baseStyles.sidebar,
    backgroundColor: "#ffffff",
    color: "#333",
  },
  menuItemActive: {
    ...baseStyles.menuItemActive,
    backgroundColor: "#e0e7ff",
    color: "#1e3a8a",
  },
  subtitle: {
    ...baseStyles.subtitle,
    color: "#6B7280",
  },
  content: {
    ...baseStyles.content,
    backgroundColor: "white",
    color: "#333",
  },
  deadlineCard: {
    ...baseStyles.deadlineCard,
    backgroundColor: "white",
    color: "#111",
  },
};

const darkStyles = {
  ...baseStyles,
  container: {
    ...baseStyles.container,
    backgroundColor: "#121212",
    color: "#eee",
  },
  sidebar: {
    ...baseStyles.sidebar,
    backgroundColor: "#1F2937",
    color: "#eee",
  },
  menuItem: {
    ...baseStyles.menuItem,
    color: "#eee",
  },
  menuItemActive: {
    ...baseStyles.menuItemActive,
    backgroundColor: "#374151",
    color: "#fff",
  },
  subtitle: {
    ...baseStyles.subtitle,
    color: "#bbb",
  },
  content: {
    ...baseStyles.content,
    backgroundColor: "#1e1e1e",
    color: "#eee",
    boxShadow: "0 10px 30px rgba(0,0,0,0.8)",
  },
  deadlineCard: {
    ...baseStyles.deadlineCard,
    backgroundColor: "#2c2c2c",
    color: "#eee",
    boxShadow: "0 5px 15px rgba(0,0,0,0.8)",
  },
};

export default Dashboard;
