import React, { useEffect, useState } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./SingleRoom.module.css";
import { useNavigate } from "react-router-dom";
import { getRoom } from "../../http";

function SingleRoom() {
  const user = useSelector((state) => state.auth.user);
  console.log("user here in single room", user);
  const { id: roomId } = useParams();
  const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [isMute, setMute] = useState(true);

  const handleMuteClick = (clientId) => {
    if (clientId !== user.id) {
      return;
    }
    setMute((prev) => !prev);
  };
  useEffect(() => {
    handleMute(isMute, user.id);
  }, [isMute]);

  function handleManualLeave() {
    navigate("/rooms");
  }

  useEffect(() => {
    async function fetchRoom() {
      const { data } = await getRoom(roomId);
      setRoom((prev) => data);
    }
    fetchRoom();
  }, [roomId]);
  return (
    <div>
      <div className={styles.container}>
        <button onClick={handleManualLeave} className={styles.goBack}>
          <img
            style={{ color: "white" }}
            src="/images/arrow-bkwrd3.png"
            alt="arrow-left"
          />
          <span>All voice rooms</span>
        </button>
      </div>
      <div className={styles.clientsWrap}>
        <div className={styles.header}>
          <h2 className={styles.topic}>{room?.topic}</h2>
          <div className={styles.actions}>
            <button className={styles.actionBtn}>
              <img src="/images/up-hand.png" alt="" />
            </button>
            <button onClick={handleManualLeave} className={styles.actionBtn}>
              <img src="/images/win.png" alt=""></img>
              <span>leave quietly</span>
            </button>
          </div>
        </div>

        <div className={styles.clientsList}>
          {clients.map((client) => {
            return (
              <div key={client.id} className={styles.client}>
                <div className={styles.userHead}>
                  <audio
                    ref={(instance) => provideRef(instance, client.id)}
                    // controls
                    autoPlay
                  ></audio>
                  <img
                    className={styles.userAvatar}
                    src={client.avatar}
                    alt="user profile"
                  />
                  <button
                    onClick={() => handleMuteClick(client.id)}
                    className={styles.micBtn}
                  >
                    {client.muted ? (
                      <img src="/images/mic-off.png" alt="min-image" />
                    ) : (
                      <img src="/images/mic.png" alt="min-image" />
                    )}
                  </button>
                  <h4>{client.name}</h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default SingleRoom;
