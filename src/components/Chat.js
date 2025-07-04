import React, { useState, useRef, useEffect } from "react";
import { FiSend, FiMic, FiPaperclip, FiX } from "react-icons/fi";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "admin",
      type: "text",
      content: "Welcome! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [recording, setRecording] = useState(false);
  const [showCancelRecording, setShowCancelRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    return () => {
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== "inactive"
      ) {
        mediaRecorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (recording) return;
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      alert("Voice recording is not supported in your browser.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        sendMessage({
          type: "audio",
          content: url,
          blob,
          timestamp: new Date(),
        });
        audioChunksRef.current = [];

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        setShowCancelRecording(false);
      };

      recorder.start();
      setRecording(true);
      setShowCancelRecording(true);
    } catch (err) {
      alert("Microphone access denied or error: " + err.message);
    }
  };

  const stopRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      setShowCancelRecording(false);
    }
  };

  const cancelRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
      setRecording(false);
      audioChunksRef.current = [];
      setShowCancelRecording(false);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }
  };

  const sendMessage = (msg) => {
    const newMsg = {
      id: Date.now(),
      sender: "user",
      ...msg,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
  };

  const handleSendText = () => {
    if (input.trim() === "") return;
    sendMessage({ type: "text", content: input.trim(), timestamp: new Date() });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    sendMessage({
      type: "file",
      content: url,
      fileName: file.name,
      fileType: file.type,
      timestamp: new Date(),
    });
    e.target.value = "";
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageContent = (msg) => {
    switch (msg.type) {
      case "text":
        return (
          <p style={{ margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
        );
      case "audio":
        return (
          <audio
            controls
            src={msg.content}
            style={{ maxWidth: 220, borderRadius: 8 }}
          >
            Your browser does not support audio playback.
          </audio>
        );
      case "file":
        return (
          <a
            href={msg.content}
            download={msg.fileName}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#2563eb",
              textDecoration: "underline",
              wordBreak: "break-word",
            }}
          >
            📎 {msg.fileName}
          </a>
        );
      default:
        return null;
    }
  };

  // Simple avatar with initials for admin and user
  const getAvatar = (sender) => {
    if (sender === "admin") {
      return (
        <div style={{ ...styles.avatar, backgroundColor: "#2563eb" }}>A</div>
      );
    }
    return (
      <div style={{ ...styles.avatar, backgroundColor: "#4f46e5" }}>U</div>
    );
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h2 style={{ margin: 0, fontWeight: "bold" }}>SmartTasker Chat</h2>
        <small style={{ color: "#666" }}>Admin & User conversation</small>
      </header>

      <main style={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{
              ...styles.message,
              ...(msg.sender === "user"
                ? styles.userMessage
                : styles.adminMessage),
            }}
          >
            {getAvatar(msg.sender)}
            <div style={styles.bubbleWrapper}>
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor:
                    msg.sender === "user" ? "#4f46e5" : "#e0e7ff",
                  color: msg.sender === "user" ? "white" : "#1e293b",
                }}
              >
                {renderMessageContent(msg)}
              </div>
              <div
                style={{
                  ...styles.timestamp,
                  textAlign: msg.sender === "user" ? "right" : "left",
                  color: msg.sender === "user" ? "#c7d2fe" : "#64748b",
                }}
              >
                {formatTime(new Date(msg.timestamp))}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </main>

      <form
        style={styles.inputArea}
        onSubmit={(e) => {
          e.preventDefault();
          handleSendText();
        }}
      >
        {showCancelRecording && (
          <button
            type="button"
            onClick={cancelRecording}
            title="Cancel Recording"
            style={styles.cancelRecordingButton}
          >
            <FiX size={20} />
          </button>
        )}

        <button
          type="button"
          onClick={recording ? stopRecording : startRecording}
          title={recording ? "Stop Recording" : "Record Voice"}
          style={{
            ...styles.voiceButton,
            backgroundColor: recording ? "#dc2626" : "#4f46e5",
          }}
        >
          <FiMic size={20} />
        </button>

        <textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          style={styles.textArea}
          rows={1}
          maxLength={1000}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current.click()}
          title="Attach document"
          style={styles.attachButton}
        >
          <FiPaperclip size={20} />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
          accept="*"
        />

        <button type="submit" title="Send message" style={styles.sendButton}>
          <FiSend size={20} />
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 480,
    height: 650,
    display: "flex",
    flexDirection: "column",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    overflow: "hidden",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#fff",
  },
  header: {
    padding: 20,
    borderBottom: "1px solid #e2e8f0",
    backgroundColor: "#3730a3",
    color: "#fff",
    userSelect: "none",
  },
  messagesContainer: {
    flex: 1,
    padding: "20px 16px",
    overflowY: "auto",
    backgroundColor: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  message: {
    display: "flex",
    alignItems: "flex-end",
    gap: 12,
  },
  userMessage: {
    flexDirection: "row-reverse",
  },
  adminMessage: {
    flexDirection: "row",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: "#4f46e5",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "700",
    fontSize: 16,
    userSelect: "none",
    flexShrink: 0,
  },
  bubbleWrapper: {
    maxWidth: "70%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  bubble: {
    padding: "12px 18px",
    borderRadius: 20,
    fontSize: 15,
    lineHeight: 1.4,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    wordBreak: "break-word",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    userSelect: "none",
  },
  inputArea: {
    display: "flex",
    alignItems: "center",
    padding: "10px 16px",
    borderTop: "1px solid #e2e8f0",
    gap: 10,
    backgroundColor: "#fff",
  },
  voiceButton: {
    border: "none",
    color: "#fff",
    fontSize: 20,
    padding: 12,
    borderRadius: "50%",
    cursor: "pointer",
    userSelect: "none",
    minWidth: 44,
    minHeight: 44,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelRecordingButton: {
    border: "none",
    color: "#dc2626",
    backgroundColor: "#fee2e2",
    padding: 8,
    borderRadius: 8,
    cursor: "pointer",
    userSelect: "none",
  },
  textArea: {
    flex: 1,
    fontSize: 15,
    borderRadius: 20,
    border: "1px solid #cbd5e1",
    padding: "8px 14px",
    resize: "none",
    outline: "none",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    maxHeight: 100,
    minHeight: 36,
  },
  sendButton: {
    marginLeft: 4,
    backgroundColor: "#4f46e5",
    border: "none",
    borderRadius: "50%",
    color: "white",
    width: 44,
    height: 44,
    cursor: "pointer",
    fontSize: 20,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    userSelect: "none",
    transition: "background-color 0.3s ease",
  },
  attachButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#6b7280",
    cursor: "pointer",
    userSelect: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    borderRadius: 8,
    transition: "background-color 0.2s ease",
  },
};

export default Chat;
