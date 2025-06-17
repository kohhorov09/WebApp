import React, { useState, useEffect } from "react";
import img1 from "../../Img/img_1.png";
import img2 from "../../Img/img_2.png";
import img3 from "../../Img/img_3.png";
import img4 from "../../Img/img_4.png";
import img5 from "../../Img/img_5.png";
import img6 from "../../Img/img_6.png";
import img7 from "../../Img/img_7.png";
import img9 from "../../Img/img-9.png";
import style from "./style.module.css";

// Raqam formatlash
function formatNumber(num) {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "K";
  return num.toString();
}

export default function UperGrade({
  coins,
  setCoins,
  upgradeLevel,
  setUpgradeLevel,
  maxEnergy,
  setMaxEnergy,
  energy,
  setEnergy,
  boughtEnergy,
  setBoughtEnergy,
  setTapMultiplier,
  rechargeAmount,
  setRechargeAmount,
  boostX2Count,
  setBoostX2Count,
  multitapCount,
  setMultitapCount,
  energyLimitCount,
  setEnergyLimitCount,
  rechargeCount,
  setRechargeCount,
  selectedSkin,
  setSelectedSkin,
}) {
  const [boostActive, setBoostActive] = useState(false);

  const skins = [
    { id: "default", name: "Classic", price: 0, img: img1 },
    { id: "gold", name: "Dollor", price: 1000, img: img2 },
    { id: "diamond", name: "Diamond", price: 5000, img: img3 },
    { id: "fire", name: "Fire", price: 5800, img: img4 },
    { id: "ice", name: "Ton", price: 8900, img: img5 },
    { id: "neon", name: "Neon", price: 9600, img: img6 },
    { id: "toxic", name: "Bitc", price: 10100, img: img7 },
    { id: "cyber", name: "Cyber", price: 14800, img: img9 },
  ];

  const [purchasedSkins, setPurchasedSkins] = useState(
    JSON.parse(localStorage.getItem("purchasedSkins")) || ["default"]
  );

  // selectedSkin localStorage orqali boshlang'ich holatda
  const [localSelectedSkin, setLocalSelectedSkin] = useState(() => {
    return localStorage.getItem("selectedSkin") || "default";
  });

  // propga localdan uzatish
  useEffect(() => {
    setSelectedSkin(localSelectedSkin);
  }, [localSelectedSkin]);

  // Dastlabki qiymatlarni localStorage dan olish
  useEffect(() => {
    const x2 = parseInt(localStorage.getItem("boostX2Count")) || 0;
    const mt = parseInt(localStorage.getItem("multitapCount")) || 1;
    const el = parseInt(localStorage.getItem("energyLimitCount")) || 0;
    const rc = parseInt(localStorage.getItem("rechargeCount")) || 1;

    setBoostX2Count(x2);
    setMultitapCount(mt);
    setEnergyLimitCount(el);
    setRechargeCount(rc);
    setRechargeAmount(rc);
  }, []);

  // O'zgarishlarni localStorage ga saqlash
  useEffect(() => {
    localStorage.setItem("boostX2Count", boostX2Count);
    localStorage.setItem("multitapCount", multitapCount);
    localStorage.setItem("energyLimitCount", energyLimitCount);
    localStorage.setItem("rechargeCount", rechargeCount);
    localStorage.setItem("purchasedSkins", JSON.stringify(purchasedSkins));
    localStorage.setItem("selectedSkin", localSelectedSkin);
  }, [
    boostX2Count,
    multitapCount,
    energyLimitCount,
    rechargeCount,
    purchasedSkins,
    localSelectedSkin,
  ]);

  // Skin sotib olish
  const handleSkinPurchase = (skin) => {
    if (purchasedSkins.includes(skin.id)) {
      setLocalSelectedSkin(skin.id);
    } else if (coins >= skin.price) {
      setCoins(coins - skin.price);
      setPurchasedSkins((prev) => [...prev, skin.id]);
      setLocalSelectedSkin(skin.id);
    }
  };

  // Boost funksiyalari
  const handleBoostX2 = () => {
    const cost = 400 * (boostX2Count + 1);
    if (coins >= cost && !boostActive) {
      setCoins((prev) => prev - cost);
      setBoostX2Count((prev) => prev + 1);
      setBoostActive(true);
      setTapMultiplier(2);
      setTimeout(() => {
        setTapMultiplier(1);
        setBoostActive(false);
      }, 10000);
    }
  };

  const handleMultitap = () => {
    const cost = 400 * (multitapCount + 1);
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setUpgradeLevel((prev) => prev + 1);
      setMultitapCount((prev) => prev + 1);
    }
  };

  const handleEnergyLimit = () => {
    const cost = 200 * (energyLimitCount + 1);
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setMaxEnergy((prev) => prev + 500);
      setEnergy((prev) => prev + 500);
      setBoughtEnergy((prev) => prev + 1);
      setEnergyLimitCount((prev) => prev + 1);
    }
  };

  const handleRechargeSpeed = () => {
    const cost = 2000 * (rechargeCount + 1);
    if (coins >= cost) {
      setCoins((prev) => prev - cost);
      setRechargeCount((prev) => {
        const newCount = prev + 1;
        setRechargeAmount(newCount);
        return newCount;
      });
    }
  };

  const boosters = [
    {
      name: "Boost X2",
      cost: 1000 * (boostX2Count + 1),
      icon: "🚀",
      onClick: handleBoostX2,
      disabled: coins < 1000 * (boostX2Count + 1) || boostActive,
      level: boostX2Count,
    },
    {
      name: "Multitap",
      cost: 2000 * (multitapCount + 1),
      icon: "🖐️",
      onClick: handleMultitap,
      disabled: coins < 2000 * (multitapCount + 1),
      level: multitapCount,
    },
    {
      name: "Energy Limit",
      cost: 4000 * (energyLimitCount + 1),
      icon: "🔋",
      onClick: handleEnergyLimit,
      disabled: coins < 4000 * (energyLimitCount + 1),
      level: energyLimitCount,
    },
    {
      name: "Recharging Speed",
      cost: 5000 * (rechargeCount + 1),
      icon: "⚡",
      onClick: handleRechargeSpeed,
      disabled: coins < 5000 * (rechargeCount + 1),
      level: rechargeCount,
    },
  ];

  return (
    <div
      style={{
        padding: "1rem",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      {/* 🔋 BOOSTLAR BO'LIMI */}
      <h2 style={{ color: "#fff", marginBottom: "1rem" }}>⚡ Boostlar</h2>
      {boosters.map((b, i) => (
        <div
          key={i}
          onClick={!b.disabled ? b.onClick : undefined}
          style={{
            background: b.disabled ? "#333" : "#222",
            opacity: b.disabled ? 0.5 : 1,
            borderRadius: "1rem",
            padding: "1rem",
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "white",
            cursor: b.disabled ? "not-allowed" : "pointer",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "1.8rem" }}>{b.icon}</span>
            <div>
              <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                {b.name}
              </div>
              <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
                🪙 {formatNumber(b.cost)} | Level: {b.level}
                {b.name === "Boost X2" && boostActive && " ⏳ Aktiv"}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 🧥 SKINS BO'LIMI */}
      <h2 style={{ color: "#fff", marginTop: "2rem", marginBottom: "1rem" }}>
        🧥 Skins
      </h2>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          // marginLeft: "1rem",
          justifyContent: "center",
        }}
        className={style.skin_grid}
      >
        {skins.map((skin) => {
          const isPurchased = purchasedSkins.includes(skin.id);
          const isSelected = localSelectedSkin === skin.id;
          const canBuy = coins >= skin.price;
          const isDisabled = !isPurchased && !canBuy;

          return (
            <div
              key={skin.id}
              style={{
                background: "#111",
                border: isSelected ? "3px solid gold" : "1px solid #555",
                borderRadius: "1rem",
                padding: "1rem",
                width: "120px",
                color: "white",
                textAlign: "center",
                cursor: isDisabled ? "not-allowed" : "pointer",
                boxShadow: isSelected
                  ? "0 0 15px gold"
                  : "0 0 5px rgba(0,0,0,0.5)",
                opacity: isDisabled ? 0.5 : 1,
              }}
              onClick={() => !isDisabled && handleSkinPurchase(skin)}
            >
              <img
                src={skin.img}
                alt={skin.name}
                style={{
                  width: "100%",
                  height: "80px",
                  objectFit: "contain",
                  marginBottom: "0.5rem",
                }}
              />
              <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>
                {skin.name}
              </div>
              <div style={{ fontSize: "0.8rem", color: "#aaa" }}>
                {isPurchased ? "✅ Olingan" : `🪙 ${formatNumber(skin.price)}`}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
