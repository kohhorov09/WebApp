// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EranPage from "./components/EranPage";
import UperGrade from "./components/UperGrade";
import Navbar from "./components/Navbar";
import Missions from "./components/Missions";
import AccountPage from "./components/Accaunt";

function App() {
  const [chatId, setChatId] = useState(null);
  const [userData, setUserData] = useState({}); // { [chatId]: {coins, upgrades, etc} }

  const defaultState = {
    coins: 0,
    upgradeLevel: 1,
    maxEnergy: 1000,
    energy: 1000,
    boostX2Count: 0,
    multitapCount: 1,
    energyLimitCount: 0,
    rechargeCount: 1,
    rechargeAmount: 1,
    purchasedSkins: ["default"],
    selectedSkin: "default",
  };

  // ✅ Chat ID olish (Telegram WebApp orqali)
  useEffect(() => {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      const id = window.Telegram.WebApp.initDataUnsafe.user.id.toString();
      setChatId(id);

      // ChatId asosida localStorage dan o‘qish
      const saved = localStorage.getItem("user_" + id);
      if (saved) {
        setUserData(JSON.parse(saved));
      } else {
        setUserData({ [id]: defaultState });
      }
    }
  }, []);

  // ✅ Har safar userData o‘zgarsa localStorage ga yoziladi
  useEffect(() => {
    if (chatId) {
      localStorage.setItem("user_" + chatId, JSON.stringify(userData));
    }
  }, [userData, chatId]);

  // 🔄 Har bir field uchun getter/setter
  const updateField = (field, value) => {
    setUserData((prev) => ({
      ...prev,
      [chatId]: {
        ...prev[chatId],
        [field]: value,
      },
    }));
  };

  const getField = (field) => userData[chatId]?.[field] ?? defaultState[field];

  if (!chatId) return <div>⏳ Telegram orqali yuklanmoqda...</div>;

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <EranPage
              coins={getField("coins")}
              setCoins={(val) => updateField("coins", val)}
              energy={getField("energy")}
              setEnergy={(val) => updateField("energy", val)}
              maxEnergy={getField("maxEnergy")}
              rechargeAmount={getField("rechargeAmount")}
              selectedSkin={getField("selectedSkin")}
            />
          }
        />
        <Route
          path="/upergrade"
          element={
            <UperGrade
              coins={getField("coins")}
              setCoins={(val) => updateField("coins", val)}
              upgradeLevel={getField("upgradeLevel")}
              setUpgradeLevel={(val) => updateField("upgradeLevel", val)}
              maxEnergy={getField("maxEnergy")}
              setMaxEnergy={(val) => updateField("maxEnergy", val)}
              energy={getField("energy")}
              setEnergy={(val) => updateField("energy", val)}
              boughtEnergy={0}
              setBoughtEnergy={() => {}}
              setTapMultiplier={() => {}}
              rechargeAmount={getField("rechargeAmount")}
              setRechargeAmount={(val) => updateField("rechargeAmount", val)}
              boostX2Count={getField("boostX2Count")}
              setBoostX2Count={(val) => updateField("boostX2Count", val)}
              multitapCount={getField("multitapCount")}
              setMultitapCount={(val) => updateField("multitapCount", val)}
              energyLimitCount={getField("energyLimitCount")}
              setEnergyLimitCount={(val) =>
                updateField("energyLimitCount", val)
              }
              rechargeCount={getField("rechargeCount")}
              setRechargeCount={(val) => updateField("rechargeCount", val)}
              selectedSkin={getField("selectedSkin")}
              setSelectedSkin={(val) => updateField("selectedSkin", val)}
            />
          }
        />
        <Route path="/missions" element={<Missions />} />
        <Route path="/accaunt" element={<AccountPage />} />
      </Routes>
    </Router>
  );
}

export default App;
