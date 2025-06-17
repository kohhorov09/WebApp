import React, { useEffect, useState } from "react";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import Button from "@mui/material/Button";
import Carusel from "../Carusel";
import axios from "axios";

const API_URL = "http://localhost:9090/missions";

export default function AccountPage({
  missions,
  setMissions,
  subscribed,
  coins,
}) {
  const [userEmail, setUserEmail] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("loggedUser"));
    if (savedUser?.email) {
      setUserEmail(savedUser.email);
      setIsAdmin(savedUser.isAdmin);
    }

    axios
      .get(API_URL)
      .then((res) => {
        setMissions(res.data);
      })
      .catch((err) => {
        console.error("🚫 Mission load error:", err);
      });
  }, []);

  const handleLogin = () => {
    const emailTrimmed = emailInput.trim().toLowerCase();
    const passwordTrimmed = passwordInput.trim();

    const isAdminLogin =
      (emailTrimmed === "adminshb" || emailTrimmed === "adminshb@gmail.com") &&
      passwordTrimmed === "20082009";

    const userInfo = {
      email: emailTrimmed,
      isAdmin: isAdminLogin,
    };

    if (isAdminLogin || passwordTrimmed) {
      setUserEmail(emailTrimmed);
      setIsAdmin(isAdminLogin);
      localStorage.setItem("loggedUser", JSON.stringify(userInfo));
    } else {
      alert("❌ Login failed");
      setEmailInput("");
      setPasswordInput("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedUser");
    setUserEmail(null);
    setIsAdmin(false);
  };

  const handleAddMission = () => {
    if (!title || !url || !type || !price) return alert("❗To‘liq kiriting");
    if (!isAdmin) return alert("❌ Faqat admin mission qo‘sha oladi");

    const newMission = {
      title,
      url,
      type,
      price: parseInt(price),
    };

    axios
      .post(API_URL, newMission)
      .then((res) => {
        const updated = [...missions, res.data];
        setMissions(updated);
        setTitle("");
        setUrl("");
        setType("");
        setPrice("");
      })
      .catch((err) => {
        console.error("❌ Add mission error:", err);
      });
  };

  const handleDeleteMission = (id) => {
    const confirmed = window.confirm("Rostdan ham o‘chirishni xohlaysizmi?");
    if (!confirmed) return;

    axios
      .delete(`${API_URL}/${id}`)
      .then(() => {
        const updated = missions.filter((m) => m.id !== id);
        setMissions(updated);
      })
      .catch((err) => {
        console.error("❌ Delete error:", err);
      });
  };

  const inputStyle = {
    width: "100%",
    padding: windowWidth < 768 ? "8px" : "10px",
    margin: "8px 0",
    borderRadius: "6px",
    border: "1px solid #ccc",
    background: "#333",
    fontSize: windowWidth < 768 ? "0.9rem" : "1rem",
    color: "#FFF",
  };

  const styles = {
    container: {
      maxWidth: "100%",
      margin: "2rem auto",
      color: "#FFF",
    },
    panel: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      width: "100%",
      margin: "auto",
      padding: "1rem",
      maxWidth: windowWidth < 768 ? "100%" : "30%",
    },
    centered: {
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      alignItems: "center",
    },
    eyeIcon: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      cursor: "pointer",
      color: "#888",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#1976d2",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: windowWidth < 768 ? "0.9rem" : "1rem",
    },
    missionItem: {
      display: "flex",
      justifyContent: "space-between",
      backgroundColor: "#222",
      color: "#fff",
      padding: "8px 12px",
      borderRadius: "6px",
      marginBottom: "6px",
      alignItems: "center",
      border: "1px solid #444",
      flexWrap: "wrap",
      wordWrap: "break-word",
    },
    deleteBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.2rem",
      color: "red",
    },
  };

  return (
    <div>
      <div style={styles.container}>
        <div style={styles.panel}>
          {!userEmail ? (
            <div style={styles.centered}>
              <p>Connect with Email to continue</p>
              <input
                type="text"
                placeholder="Email write"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                style={inputStyle}
              />
              <div style={{ position: "relative", width: "100%" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="🔐 Password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  style={{ ...inputStyle, paddingRight: "2.5rem" }}
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  style={styles.eyeIcon}
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </span>
              </div>
              <Button onClick={handleLogin} variant="outlined">
                <h5>Email Continue</h5>
              </Button>
            </div>
          ) : isAdmin ? (
            <>
              <p>
                <strong>Email:</strong> {userEmail}
              </p>
              <Button onClick={handleLogout} variant="outlined" color="error">
                Logout
              </Button>
              <input
                placeholder="🎯 Mission Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={inputStyle}
              />
              <input
                placeholder="🔗 Mission URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={inputStyle}
              />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={inputStyle}
              >
                <option value="">📌 Select type</option>
                <option value="instagram">Instagram</option>
                <option value="group">Telegram Group</option>
                <option value="channel">Telegram Channel</option>
              </select>
              <input
                placeholder="💰 Mission narxi (coins)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={inputStyle}
              />
              <button onClick={handleAddMission} style={styles.button}>
                ➕ Add Mission
              </button>
              <div style={{ marginTop: "1rem" }}>
                <h4>📋 Existing Missions</h4>
                {missions.length === 0 ? (
                  <p style={{ color: "#aaa" }}>🚫 No missions yet.</p>
                ) : (
                  missions.map((m) => (
                    <div key={m.id} style={styles.missionItem}>
                      <span
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          fontSize: windowWidth < 768 ? "0.85rem" : "1rem",
                          flexWrap: "wrap",
                          gap: "4px",
                        }}
                      >
                        ✅ <strong>{m.title}</strong>
                        <span style={{ color: "#aaa" }}>({m.type})</span>
                        <span style={{ color: "#bbb" }}>💰 {m.price} coin</span>
                      </span>
                      <button
                        onClick={() => handleDeleteMission(m.id)}
                        style={styles.deleteBtn}
                        title="O‘chirish"
                      >
                        🗑️
                      </button>
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button onClick={handleLogout} variant="outlined" color="error">
                  Logout
                </Button>
              </div>
              <Carusel coins={coins} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
