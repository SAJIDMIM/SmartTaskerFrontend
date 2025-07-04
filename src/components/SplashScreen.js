import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg";

const SplashScreen = () => {
  const navigate = useNavigate();

  // We track hover state locally in each button using React useState or simpler: inline handlers

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <img src={logo} alt="SmartTasker Logo" style={styles.logo} />
        <h1 style={styles.title}>
          Welcome to <span style={styles.highlight}>SmartTasker</span>
        </h1>
        <p style={styles.description}>
          Organize your tasks, boost productivity, and achieve your goals
          effortlessly.
        </p>
        <div style={styles.buttonGroup}>
          <HoverButton
            onClick={() => navigate("/signup")}
            baseStyle={{ ...styles.button, ...styles.getStarted }}
            hoverStyle={{
              backgroundColor: "transparent",
              color: "#4F46E5",
              boxShadow: "none",
              border: "2.5px solid #4F46E5",
            }}
          >
            Get Started
          </HoverButton>
          <HoverButton
            onClick={() => navigate("/login")}
            baseStyle={{ ...styles.button, ...styles.haveAccount }}
            hoverStyle={{
              backgroundColor: "#4F46E5",
              color: "white",
            }}
          >
            Have an account?
          </HoverButton>
        </div>
      </div>
    </div>
  );
};

// Helper component for hover effect using React state
const HoverButton = ({ onClick, baseStyle, hoverStyle, children }) => {
  const [hovered, setHovered] = React.useState(false);

  const combinedStyle = hovered ? { ...baseStyle, ...hoverStyle } : baseStyle;

  return (
    <button
      style={combinedStyle}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
};

const styles = {
  container: {
    background: "linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    backgroundColor: "white",
    padding: "50px 40px",
    borderRadius: "24px",
    textAlign: "center",
    boxShadow: "0 20px 40px rgba(101, 41, 255, 0.3)",
    maxWidth: "420px",
    width: "100%",
    userSelect: "none",
  },
  logo: {
    width: "110px",
    marginBottom: "25px",
    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.15))",
  },
  title: {
    marginBottom: "15px",
    fontSize: "30px",
    color: "#1F2937",
    fontWeight: "700",
  },
  highlight: {
    color: "#6B46C1",
  },
  description: {
    fontSize: "17px",
    color: "#4B5563",
    marginBottom: "40px",
    lineHeight: "1.5",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "18px",
  },
  button: {
    flex: "1",
    padding: "14px 0",
    fontSize: "17px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "all 0.25s ease",
    userSelect: "none",
  },
  getStarted: {
    backgroundColor: "#4F46E5",
    color: "white",
    boxShadow: "0 8px 15px rgba(79, 70, 229, 0.3)",
  },
  haveAccount: {
    backgroundColor: "transparent",
    color: "#4F46E5",
    border: "2.5px solid #4F46E5",
  },
};

export default SplashScreen;
