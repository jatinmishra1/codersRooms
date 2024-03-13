import React from "react";
import styles from "./Loader.module.css";
import Card from "../Card/Card";

function Loader({ message }) {
  return (
    <div className={styles.cardWrapper}>
      <Card>
        <svg
          className={styles.spinner}
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          id="loading"
        >
          <path
            d="M14 0h4v8h-4zM25.9 3.272l2.828 2.829-5.657 5.656-2.828-2.828zM32 14v4h-8v-4zM28.728 25.9l-2.829 2.828-5.656-5.657 2.828-2.828zM18 32h-4v-8h4zM6.1 28.728l-2.828-2.829 5.657-5.656 2.828 2.828zM0 18v-4h8v4zM3.272 6.1l2.829-2.828 5.656 5.657-2.828 2.828z"
            opacity=".1"
            fill="#ffffff"
          ></path>
        </svg>

        <span className={styles.message}>{message}</span>
      </Card>
    </div>
  );
}

export default Loader;
