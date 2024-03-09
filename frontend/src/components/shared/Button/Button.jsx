import React from "react";
import styles from "./Button.module.css";
function Button({ text, onClick }) {
  return (
    <button onClick={onClick} className={styles.button}>
      <span>{text}</span>
      <img className={styles.arrow} src="/images/arrow-frwd.png" alt="arrow" />
    </button>
  );
}

export default Button;
