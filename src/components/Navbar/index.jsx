// Navbar.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function BottomNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = [
    { name: "Earn", emoji: "🪙", path: "/" },
    { name: "UperGrade", emoji: "✅", path: "/uperGrade" },
    { name: "Missions", emoji: "😎", path: "/missions" },
    { name: "Accaunt", emoji: "🤖", path: "/accaunt" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "linear-gradient(to top, #1f1c2c, #2a2a72)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: "0.55rem 0.5rem",
        borderTop: "1px solid #333",
        borderTopLeftRadius: "0.5rem",
        borderTopRightRadius: "0.5rem",
        boxShadow: "0 -5px 15px rgba(0,0,0,0.5)",
        zIndex: 999,
        paddingRight: "20px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <div
            key={tab.name}
            onClick={() => navigate(tab.path)}
            style={{
              flex: 1,
              margin: "0 0.25px",
              background: isActive ? "#322e4d" : "transparent",
              border: isActive ? "1px solid #facc15" : "1px solid transparent",
              borderRadius: "1rem",
              padding: "0.5rem",
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
              color: isActive ? "#facc15" : "#ccc",
              fontWeight: "bold",
              fontSize: "0.9rem",
            }}
          >
            <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
              <h5> {tab.emoji}</h5>
            </div>

            <h6>{tab.name}</h6>
          </div>
        );
      })}
    </div>
  );
}
