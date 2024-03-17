import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallBack } from "./useStateWithCalllBack";
import { socketInit } from "../socket/index";
import { ACTIONS } from "../action";
// const users = [
//   {
//     id: 1,
//     name: "jatin",
//   },
//   {
//     id: 2,
//     name: "ravi",
//   },
// ];
export const useWebRTC = (roomId, user) => {
  console.log("user in webrtc", user);
  const [clients, setClients] = useStateWithCallBack([]);
  const audioElements = useRef({
    //userId:audioInstance
  });
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  useEffect(() => {
    socket.current = socketInit();
  }, []);
  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  const addNewClients = useCallback(
    (newClient, cb) => {
      console.log(newClient, clients, "here are the list");
      const lookingFor = clients.find((client) => client.id === newClient.id);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }

      //socket emit join socket io
      socket.current.emit(ACTIONS.JOIN, { roomId, user });
      socket.join(roomId);
    },
    [clients, setClients]
  );

  //capture audio from your syatem
  useEffect(() => {
    const startCapture = async () => {
      localMediaStream.current = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
    };
    startCapture().then(() => {
      addNewClients(user, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          localElement.srcObject = localMediaStream.current;
        }
      });
    });
  }, []);

  return { clients, provideRef };
};
