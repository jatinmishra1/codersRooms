import React, { useCallback, useEffect, useRef, useState } from "react";
import { useStateWithCallback } from "./useStateWithCalllBack";
import { socketInit } from "../socket/index";
import { ACTIONS } from "../action";
import freeice from "freeice";
import { json } from "react-router-dom";
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
  const [clients, setClients] = useStateWithCallback([]);
  const audioElements = useRef({
    //userId:audioInstance
  });
  const connections = useRef({});
  const localMediaStream = useRef(null);
  const socket = useRef(null);
  const clientsRef = useRef([]);
  useEffect(() => {
    socket.current = socketInit();
  }, []);

  const addNewClient = useCallback(
    (newClient, cb) => {
      console.log(newClient, clients, "here are the list");
      const lookingFor = clients.find((client) => client.id === newClient.id);
      console.log("looking undefined", lookingFor);
      if (lookingFor === undefined) {
        setClients((existingClients) => [...existingClients, newClient], cb);
      }
      console.log("looking undefined not", lookingFor, clients);
      console.log(newClient, clients, "here are the list2");
      //socket emit join socket io
      socket.current.emit(ACTIONS.JOIN, { roomId, user });
      // socket.join(roomId);
      console.log("here are clients", clients);
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
      console.log(user, "here are the users");
      addNewClient({ ...user, muted: true }, () => {
        const localElement = audioElements.current[user.id];
        if (localElement) {
          localElement.volume = 0;
          console.log("here is the mdeia stream");
          localElement.srcObject = localMediaStream.current;
        }
        socket.current.emit(ACTIONS.JOIN, { roomId, user });
      });
    });
    return () => {
      //leaving the room
      localMediaStream.current?.getTracks()?.forEach((track) => {
        track.stop();
      });
      socket.current.emit(ACTIONS.LEAVE, { roomId });
    };
  }, []);

  useEffect(() => {
    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
      //if already connected then give warning
      if (peerId in connections.current) {
        return console.warn(`you are already connected with peerId ${peerId}`);
      }
      connections.current[peerId] = new RTCPeerConnection({
        iceServers: freeice(),
      });
      //handle new ice candidates
      connections.current[peerId].onicecandidate = (event) => {
        socket.current.emit(ACTIONS.RELAY_ICE, {
          peerId,
          icecandidate: event.candidate,
        });
      };

      //handle on track on this connection
      connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
        addNewClient({ ...remoteUser, muted: true }, () => {
          if (audioElements.current[remoteUser.id]) {
            audioElements.current[remoteUser.id].srcObject = remoteStream;
          } else {
            let settled = false;
            const interval = setInterval(() => {
              if (audioElements.current[remoteUser.id]) {
                audioElements.current[remoteUser.id].srcObject = remoteStream;
                settled = true;
                if (settled) {
                  clearInterval(interval);
                }
              }
            }, 1000);
          }
        });
      };

      //add local track to remote connections
      localMediaStream.current?.getTracks()?.forEach((track) => {
        connections.current[peerId].addTrack(track, localMediaStream.current);
      });
      //crate offer
      if (createOffer) {
        const offer = await connections.current[peerId].createOffer();
        await connections.current[peerId].setLocalDescription(offer);

        //send offer to another client
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: offer,
        });
      }
    };

    socket.current.on(ACTIONS.ADD_PEER, handleNewPeer);
    return () => {
      socket.current.off(ACTIONS.ADD_PEER);
    };
  }, []);
  //handle ice candidate
  useEffect(() => {
    socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
      if (icecandidate) {
        connections.current[peerId].addIceCandidate(icecandidate);
      }
    });
    return () => {
      socket.current.off(ACTIONS.ICE_CANDIDATE);
    };
  }, []);
  //handle SDP
  useEffect(() => {
    const handleRemoteSDP = async ({
      peerId,
      sessionDescription: remoteSessionDescription,
    }) => {
      connections.current[peerId].setRemoteDescription(
        new RTCSessionDescription(remoteSessionDescription)
      );
      //if session description of type of offer the craete a answer
      if (remoteSessionDescription.type === "offer") {
        const connection = connections.current[peerId];
        const answer = await connection.createAnswer();
        connection.setLocalDescription(answer);
        socket.current.emit(ACTIONS.RELAY_SDP, {
          peerId,
          sessionDescription: answer,
        });
      }
    };
    socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP);
    return () => socket.current.off(ACTIONS.SESSION_DESCRIPTION);
  }, []);

  //handle remove peer
  useEffect(() => {
    const handleRemovePeer = ({ peerId, userId }) => {
      if (connections.current[peerId]) {
        connections.current[peerId].close();
      }
      delete connections.current[peerId];
      delete audioElements.current[peerId];
      setClients((list) => list.filter((client) => client.id !== userId));
    };
    socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer);
    return () => socket.current.off(ACTIONS.REMOVE_PEER);
  });

  useEffect(() => {
    clientsRef.current = clients;
  }, [clients]);

  //listen for mute unmute

  useEffect(() => {
    socket.current.on(ACTIONS.MUTE, ({ peerId, userId }) => {
      setMute(true, userId);
    });

    const setMute = (mute, userId) => {
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);
    };
  }, []);

  useEffect(() => {
    socket.current.on(ACTIONS.UN_MUTE, ({ peerId, userId }) => {
      setMute(false, userId);
    });

    const setMute = (mute, userId) => {
      console.log("mute value ", mute);
      const clientIdx = clientsRef.current
        .map((client) => client.id)
        .indexOf(userId);
      const connectedClients = JSON.parse(JSON.stringify(clientsRef.current));
      if (clientIdx > -1) {
        connectedClients[clientIdx].muted = mute;
        setClients(connectedClients);
      }
    };
  }, []);

  const provideRef = (instance, userId) => {
    audioElements.current[userId] = instance;
  };

  //handling mute
  const handleMute = (isMute, userId) => {
    console.log(isMute, userId, "here is the handlemUte function");
    let settled = false;
    let interval = setInterval(() => {
      if (localMediaStream.current) {
        localMediaStream.current.getTracks()[0].enabled = !isMute;
        if (isMute) {
          socket.current.emit(ACTIONS.MUTE, {
            roomId,
            userId: userId,
          });
        } else {
          socket.current.emit(ACTIONS.UN_MUTE, { roomId, userId: userId });
        }
        settled = true;
      }
      if (settled) {
        clearInterval(interval);
      }
    }, 200);
  };

  return { clients, provideRef, handleMute };
};
