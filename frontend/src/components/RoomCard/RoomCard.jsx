import React from "react";
import styles from "./RoomCard.module.css";

function RoomCard({ room }) {
  return (
    <div className={styles.card}>
      <h3>{room.topic}</h3>
      <div className={styles.speakers}>
        <div className={styles.avatars}>
          {room.speakers.map((speaker) => {
            return <img src={speaker.avatar} alt="speaker-avatar" />;
          })}
        </div>
        <div className={styles.names}>
          {room.speakers.map((speaker) => {
            return (
              <div className={styles.namesWrapper}>
                <span>{speaker.name}</span>
                <img src="/images/chatBubble.png" alt="chat-bubbler" />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.peopleCount}>
        <span>{room.totalPeople}</span>
        <img src="/images/userImage.png" alt="user-icon" />
      </div>
    </div>
  );
}

export default RoomCard;
