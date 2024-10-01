import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/login");
  };

  return (
    <div className={styles.landingPage}>

      <div className={styles.contentContainer}>
        <h1 className={styles.title}>Welcome to ToDo App</h1>
        <p className={styles.subtitle}>
          Stay organized and boost your productivity with our simple and effective task management app.
        </p>
        <button className={styles.startButton} onClick={handleStartClick}>
          Get Started
        </button>
      </div>

      
    </div>
  );
}
