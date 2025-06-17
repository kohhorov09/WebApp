// src/components/TopStatusPanel.jsx
import React, { useState, useEffect } from "react";

// 💡 Raqamni formatlovchi funksiya (1M, 1B, 1T)
function formatNumber(num) {
  if (num >= 1_000_000_000_000)
    return (num / 1_000_000_000_000).toFixed(1) + "T";
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  return num;
}

export default function TopStatusPanel({ coins, boughtEnergy, level }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        borderRadius: "1rem",
        padding: "1rem 2rem",
        backdropFilter: "blur(10px)",
        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
        margin: "-1rem auto",
        color: "white",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: isMobile ? "center" : "center",
        maxWidth: "400px",
        width: "100%",
        // flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "1rem" : "0.5rem",
        textAlign: "center",
      }}
    >
      <StatusItem title="💰 Coin" value={formatNumber(coins)} />
      <StatusItem title="⚡ Bought" value={boughtEnergy} />
      <StatusItem title="🧬 Level" value={level} />
    </div>
  );
}

function StatusItem({ title, value }) {
  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h5 style={{ margin: 0, color: "#facc15", fontSize: "16px" }}>{title}</h5>
      <p style={{ margin: 0, fontSize: "15px", fontWeight: "bold" }}>{value}</p>
    </div>
  );
}
