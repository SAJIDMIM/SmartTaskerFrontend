import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpg"; // Adjust path if needed

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // State for custom alert
  const [alertMsg, setAlertMsg] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const showCustomAlert = (msg) => {
    setAlertMsg(msg);
    setShowAlert(true);
  };

  const closeAlert = () => setShowAlert(false);

  // Icons inside component for scope safety
  const EmailIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#6B46C1"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z" />
    </svg>
  );

  const PasswordIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      stroke="#6B46C1"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      style={{
        position: "absolute",
        left: "12px",
        top: "50%",
        transform: "translateY(-50%)",
      }}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://yh43cj-5000.csb.app/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        showCustomAlert(data.message);
        // Delay navigation so user can see alert
        setTimeout(() => navigate("/home"), 1500);
      } else {
        showCustomAlert(data.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      showCustomAlert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <div style={styles.container}>
        <div style={styles.bgCircle} />
        <img src={logo} alt="Background Logo" style={styles.bgLogo} />

        <div style={styles.card}>
          <div style={styles.header}>
            <img src={logo} alt="SmartTasker Logo" style={styles.logo} />
            <h2 style={styles.title}>Login : SmartTasker</h2>
          </div>
          <p style={styles.description}>
            Welcome back! Please enter your credentials to access your
            productivity dashboard.
          </p>
          <form onSubmit={handleSubmit} style={styles.form}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <div style={styles.inputWrapper}>
              <EmailIcon />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                style={styles.input}
              />
            </div>

            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <div style={styles.inputWrapper}>
              <PasswordIcon />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                style={styles.input}
              />
            </div>

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <p style={styles.footerText}>
            Don't have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/signup")}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") navigate("/signup");
              }}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      {showAlert && (
        <div style={alertStyles.overlay}>
          <div style={alertStyles.modal}>
            <p>{alertMsg}</p>
            <button onClick={closeAlert} style={alertStyles.button}>
              OK
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  container: {
    position: "relative",
    background: "linear-gradient(135deg, #6B46C1 0%, #3B82F6 100%)",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    overflow: "hidden",
    backgroundImage: `radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
       radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)`,
    backgroundPosition: "0 0, 25px 25px",
    backgroundSize: "50px 50px",
  },
  bgCircle: {
    position: "absolute",
    top: "30%",
    left: "70%",
    width: "400px",
    height: "400px",
    backgroundColor: "rgba(101, 41, 255, 0.4)",
    borderRadius: "50%",
    filter: "blur(90px)",
    transform: "translate(-50%, -50%)",
    zIndex: 0,
  },
  bgLogo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "350px",
    height: "350px",
    objectFit: "contain",
    opacity: 0.1,
    transform: "translate(-50%, -50%)",
    userSelect: "none",
    pointerEvents: "none",
    zIndex: 0,
  },
  card: {
    position: "relative",
    backgroundColor: "white",
    padding: "40px 30px",
    borderRadius: "24px",
    boxShadow: "0 20px 40px rgba(101, 41, 255, 0.3)",
    maxWidth: "360px",
    width: "100%",
    textAlign: "left",
    userSelect: "none",
    zIndex: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    marginBottom: "10px",
  },
  logo: {
    width: "45px",
    height: "45px",
    objectFit: "contain",
  },
  title: {
    fontSize: "24px",
    color: "#1F2937",
    fontWeight: "700",
    margin: 0,
  },
  description: {
    fontSize: "16px",
    color: "#4B5563",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },
  label: {
    fontWeight: "600",
    color: "#4B5563",
    fontSize: "14px",
    marginBottom: "6px",
  },
  inputWrapper: {
    position: "relative",
    maxWidth: "300px",
    width: "100%",
  },
  input: {
    width: "100%",
    padding: "12px 15px 12px 40px",
    fontSize: "16px",
    borderRadius: "12px",
    border: "1.5px solid #cbd5e1",
    outline: "none",
    transition: "border-color 0.25s ease",
  },
  button: {
    marginTop: "10px",
    padding: "14px 0",
    fontSize: "17px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#4F46E5",
    color: "white",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: "0 8px 15px rgba(79, 70, 229, 0.3)",
    transition: "background-color 0.3s ease",
  },
  footerText: {
    marginTop: "25px",
    color: "#6B7280",
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    color: "#4F46E5",
    cursor: "pointer",
    fontWeight: "600",
    textDecoration: "underline",
  },
};

const alertStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    padding: "25px 30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    maxWidth: "350px",
    width: "90%",
    textAlign: "center",
    fontSize: "16px",
    color: "#333",
  },
  button: {
    marginTop: "20px",
    padding: "12px 25px",
    backgroundColor: "#4F46E5",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: "0 5px 15px rgba(79, 70, 229, 0.3)",
    transition: "background-color 0.3s ease",
  },
};

export default Login;
