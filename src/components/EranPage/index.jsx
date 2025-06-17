import React, { useEffect, useRef, useState } from "react";
import defaultSkin from "../../Img/img_1.png";
import lightningIcon from "../../Img/energeyyyy-removebg-preview.png";

// Format funksiyasi
const formatNumber = (num) => {
  if (num >= 1e12) return (num / 1e12).toFixed(0) + "T";
  if (num >= 1e9) return (num / 1e9).toFixed(0) + "B";
  if (num >= 1e6) return (num / 1e6).toFixed(0) + "M";
  return num.toString();
};

export default function EranPage({
  coins,
  setCoins,
  setClicks,
  upgradeLevel,
  energy,
  setEnergy,
  maxEnergy,
  tapMultiplier,
  rechargeAmount,
}) {
  const [plusOnes, setPlusOnes] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const [energyLoaded, setEnergyLoaded] = useState(false);
  const [selectedSkin, setSelectedSkin] = useState(defaultSkin);
  const [totalEarnedCoins, setTotalEarnedCoins] = useState(() => {
    return parseInt(localStorage.getItem("totalEarnedCoins")) || 0;
  });

  const level = Math.floor(totalEarnedCoins / 100); // 📈 Level hisoblash

  // Skinni yuklash
  useEffect(() => {
    const skinId = localStorage.getItem("selectedSkin") || "default";
    const skinMap = {
      default: defaultSkin,
      gold: require("../../Img/img_2.png"),
      diamond: require("../../Img/img_3.png"),
      fire: require("../../Img/img_4.png"),
      ice: require("../../Img/img_5.png"),
      neon: require("../../Img/img_6.png"),
      toxic: require("../../Img/img_7.png"),
      cyber: require("../../Img/img-9.png"),
    };
    setSelectedSkin(skinMap[skinId] || defaultSkin);
  }, []);

  // ⛔️ Enter tugmasini bloklash
  useEffect(() => {
    const preventEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", preventEnter);
    return () => window.removeEventListener("keydown", preventEnter);
  }, []);

  // Coin bosish
  const handleClick = () => {
    if (energy < upgradeLevel) return;

    setIsPressed(true);
    const id = Date.now();
    setPlusOnes((prev) => [...prev, id]);

    setTimeout(() => setIsPressed(false), 100);
    setTimeout(() => {
      setPlusOnes((prev) => prev.filter((item) => item !== id));
    }, 1000);

    const earned = upgradeLevel * tapMultiplier;

    setCoins((prev) => prev + earned);
    setTotalEarnedCoins((prev) => {
      const newTotal = prev + earned;
      localStorage.setItem("totalEarnedCoins", newTotal);
      return newTotal;
    });

    setClicks((prev) => prev + 1);
    setEnergy((prev) => prev - upgradeLevel);
  };

  // Energiya tiklash
  useEffect(() => {
    const savedEnergy = parseInt(localStorage.getItem("energy")) || 0;
    const lastExitTime =
      parseInt(localStorage.getItem("lastExitTime")) || Date.now();
    const now = Date.now();
    const secondsAway = Math.floor((now - lastExitTime) / 1000);
    const energyToAdd = secondsAway * rechargeAmount;
    const newEnergy = Math.min(savedEnergy + energyToAdd, maxEnergy);
    setEnergy(newEnergy);
    setEnergyLoaded(true);
  }, [setEnergy, rechargeAmount, maxEnergy]);

  // Sahifadan chiqishda energiyani saqlash
  useEffect(() => {
    const handleUnload = () => {
      localStorage.setItem("energy", energy.toString());
      localStorage.setItem("lastExitTime", Date.now().toString());
    };
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [energy]);

  // Har 1 sekundda energiyani to‘ldirib borish
  useEffect(() => {
    if (!energyLoaded) return;
    const interval = setInterval(() => {
      setEnergy((prev) =>
        prev < maxEnergy ? Math.min(prev + rechargeAmount, maxEnergy) : prev
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [energyLoaded, maxEnergy, rechargeAmount, setEnergy]);

  return (
    <div
      style={{
        width: "100%",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Coin bosish tugmasi */}
      <div style={{ position: "relative", marginBottom: "2rem" }}>
        <button
          onClick={handleClick}
          disabled={energy <= 0}
          style={{
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            border: "none",
            background: "transparent",
            transform: isPressed ? "scale(0.95)" : "scale(1)",
            transition: "transform 0.25s ease-in-out",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 2,
            cursor: energy > 0 ? "pointer" : "not-allowed",
            opacity: energy > 0 ? 1 : 0.4,
            outline: "none",
            WebkitTapHighlightColor: "transparent",
            userSelect: "none",
            touchAction: "manipulation",
          }}
        >
          <img
            src={selectedSkin}
            alt="Coin"
            style={{
              width: "250px",
              height: "250px",
              objectFit: "contain",
              pointerEvents: "none",
            }}
            onContextMenu={(e) => e.preventDefault()}
            draggable={false}
          />
        </button>

        {plusOnes.map((id, i) => (
          <div
            key={id}
            style={{
              position: "absolute",
              top: `${30 - i * 5}%`,
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "1.5rem",
              color: "#00ff88",
              animation: "moveUpFade 1s ease-out forwards",
              zIndex: 3,
              pointerEvents: "none",
              fontWeight: "bold",
            }}
          >
            +{upgradeLevel * tapMultiplier}
          </div>
        ))}
      </div>

      {/* ⚡ Energiya */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "1rem",
          marginTop: "1rem",
          paddingLeft: "1rem",
          width: "100%",
        }}
      >
        <img src={lightningIcon} alt="energy" style={{ width: "24px" }} />
        <span style={{ fontWeight: "bold", fontSize: "1rem" }}>
          {energy} / {maxEnergy}
        </span>
      </div>

      {/* 🧬 Level */}

      {/* Plus animatsiya */}
      <style>
        {`
          @keyframes moveUpFade {
            0% { transform: translate(-50%, 0%) scale(1); opacity: 1; }
            50% { transform: translate(-50%, -60px) scale(1.3); opacity: 0.8; }
            100% { transform: translate(-50%, -120px) scale(1.5); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
}
