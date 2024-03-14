import React, { useState } from "react";
import styles from "./AddRoomModal.module.css";
import Input from "../shared/Input/Input";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";

function AddRoomModal({ onClose }) {
  const navigate = useNavigate();
  const [roomType, setRoomType] = useState("open");
  const [topic, setTopic] = useState("");
  async function createRoom() {
    try {
      if (!topic) return;
      const { data } = await create({ topic, roomType });
      console.log("after navigating", data);
      navigate(`/room/${data.id}`);
    } catch (err) {
      console.log(err.message);
    }
  }
  return (
    <div className={styles.modalMask}>
      <div className={styles.modalBody}>
        <button onClick={onClose} className={styles.closeButton}>
          <img src="/images/close.png" alt="close" />
        </button>
        <div className={styles.modalHeader}>
          <h3 className={styles.heading}>Enter the tpoic to be discussed</h3>
          <Input
            fullWidth="true"
            value={topic}
            onChange={(e) => {
              setTopic(e.target.value);
            }}
          />
          <h2 className={styles.subHeading}>Room Types</h2>
          <div className={styles.roomTypes}>
            <div
              onClick={() => setRoomType("open")}
              className={`${styles.typeBox} ${
                roomType === "open" ? styles.active : ""
              }`}
            >
              <img src="/images/globe.png" alt="globe-img" />
              <span>open</span>
            </div>
            <div
              onClick={() => setRoomType("social")}
              className={`${styles.typeBox} ${
                roomType === "social" ? styles.active : ""
              }`}
            >
              <img src="/images/social.png" alt="social-img" />
              <span>Social</span>
            </div>
            <div
              onClick={() => setRoomType("private")}
              className={`${styles.typeBox} ${
                roomType === "private" ? styles.active : ""
              }`}
            >
              <img src="/images/lock.png" alt="globe-img" />
              <span>Private</span>
            </div>
          </div>
        </div>
        ;
        <div className={styles.modalFooter}>
          <h2>Start a room, open to everyone</h2>
          <button onClick={createRoom} className={styles.footerButton}>
            <img src="/images/celebration.png" alt="celebration" />
            <span>Let's go</span>
          </button>
        </div>
        ;
      </div>
      ;
    </div>
  );
}

export default AddRoomModal;
