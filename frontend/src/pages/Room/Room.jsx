import React, { useEffect, useState } from "react";
import styles from "./Room.module.css";
import RoomCard from "../../components/RoomCard/RoomCard";
import AddRoomModal from "../../components/AddRoomModal/AddRoomModal";
import { getAllRooms } from "../../http";
// const rooms = [
//   {
//     id: 1,
//     topic: "best dev course",
//     speakers: [
//       {
//         id: 1,
//         name: "jhon",
//         avatar: "/images/Lock.png",
//       },
//       {
//         id: 2,
//         name: "jhon",
//         avatar: "/images/man.png",
//       },
//     ],
//     totalPeople: 3,
//   },
//   {
//     id: 2,
//     topic: "best dev web 3",
//     speakers: [
//       {
//         id: 1,
//         name: "jhon",
//         avatar: "/images/man.png",
//       },
//       {
//         id: 2,
//         name: "jhon",
//         avatar: "/images/man2.png",
//       },
//     ],
//     totalPeople: 5,
//   },
// ];

function Room() {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  console.log("roooms data is here", rooms);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await getAllRooms();
      console.log("the data is", data);
      setRooms(data);
    };
    fetchRooms();
  }, []);

  function openModal() {
    setShowModal(true);
  }
  return (
    <>
      <div className={styles.container}>
        <div className={styles.roomsHeader}>
          <div className={styles.left}>
            <span className={styles.heading}>All voice Rooms</span>
            <div className={styles.searchBox}>
              <img src="/images/search.png" alt="search" />
              <input className={styles.searchInput} />
            </div>
          </div>
          <div className={styles.right}>
            <button onClick={openModal} className={styles.startRoomButton}>
              <img src="/images/addRoom.png" atl="add-room-image" />
              <span>Start a Room</span>
            </button>
          </div>
        </div>

        <div className={styles.roomList}>
          {rooms &&
            rooms.map((room) => {
              return <RoomCard key={room.id} room={room} />;
            })}
        </div>
      </div>
      {showModal && <AddRoomModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export default Room;
