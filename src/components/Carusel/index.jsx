import React, { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./LeagueCarousel.css";
import leagues from "../Larguest";

export default function LeagueCarousel({ totalEarnedCoins, coins }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedGoals, setCompletedGoals] = useState([]);

  // 🎯 Goal bir marta bajarilganda saqlab qolish
  useEffect(() => {
    const storedGoals =
      JSON.parse(localStorage.getItem("completedGoals")) || [];
    const newGoals = leagues
      .filter(
        (l) => totalEarnedCoins >= l.goal && !storedGoals.includes(l.goal)
      )
      .map((l) => l.goal);

    if (newGoals.length > 0) {
      const updated = [...storedGoals, ...newGoals];
      localStorage.setItem("completedGoals", JSON.stringify(updated));
      setCompletedGoals(updated);
    } else {
      setCompletedGoals(storedGoals);
    }
  }, [totalEarnedCoins]);

  // 🎯 Sahifa ochilganda coin qaysi liga ga yetgan bo‘lsa, o‘sha league ochilsin
  useEffect(() => {
    const coinBasedIndex = leagues.findLastIndex((l) => coins >= l.goal);
    if (coinBasedIndex !== -1) {
      setCurrentIndex(coinBasedIndex);
    }
  }, [coins]);

  const current = leagues[currentIndex] || {};
  const goal = current.goal || 0;

  const calculatedProgress =
    goal > 0 ? Math.min((coins / goal) * 100, 100) : 100;

  function formatNumber(num) {
    if (typeof num !== "number" || isNaN(num)) return "0";

    if (num >= 1_000_000_000)
      return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
    if (num >= 1_000_000)
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";

    return num.toString();
  }

  return (
    <div className="carousel-container">
      <h2 className="league-title">{current.name}</h2>
      <p className="league-description">{current.description}</p>

      <div className="trophy-section">
        <button
          className="nav-button"
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
        >
          <FaChevronLeft size={24} />
        </button>

        <img src={current.image} alt={current.name} className="trophy-image" />

        <button
          className="nav-button"
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, leagues.length - 1))
          }
          disabled={currentIndex === leagues.length - 1}
        >
          <FaChevronRight size={24} />
        </button>
      </div>

      {/* 🏆 Sovg'a rasmi */}
      {completedGoals.includes(goal) && (
        <img
          src={current.image}
          alt="Unlocked Reward"
          className="reward-image"
        />
      )}

      {/* 📊 Progress bar */}
      <div className="progress-bar-container">
        <div
          className="progress-bar-fill"
          style={{ width: `${calculatedProgress}%` }}
        ></div>
      </div>

      {/* 🎯 Goal va hozirgi coin holati */}
      <p className="league-progress">
        {totalEarnedCoins >= goal ? (
          <>✅ {formatNumber(goal)}</>
        ) : (
          <>
            {formatNumber(coins)} / {formatNumber(goal)}
          </>
        )}
      </p>
    </div>
  );
}
