import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import { host } from "../Utils/APIRoutes";
import Peer from "simple-peer";

const socket = io.connect(host);

// callUser(location.state.chat._id);

export default function VideoCallPage() {
  const test = true;
  const [stream, setStream] = useState();
  const [currentUserId, setCurrentUserId] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState();
  const [name, setName] = useState();
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const currentUserVideo = useRef();
  const currentChatVideo = useRef();

  const connectionRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem("chat-app-user"));

  useEffect(() => {
    async function allowWeb() {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(stream);
      currentUserVideo.current.srcObject = stream;
      socket.on("current-user", (id) => {
        setCurrentUserId(id);
      });

      socket.on("call-user", (data) => {
        setReceivingCall(true);
        setCaller(data.from);
        setName(data.name);
        setCallerSignal(data.signal);
      });
    }

    allowWeb();
  }, []);

  const callUser = (id) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("call-user", {
        userToCall: id,
        signalData: data,
        from: currentUserId,
        name: currentUser.username,
      });
    });

    peer.on("stream", (stream) => {
      currentChatVideo.current.srcObject = stream;
    });

    socket.on("call-accepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      socket.emit("answer-call", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      currentChatVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    navigate("/");
  };

  return (
    <>
      <h1>Web Call</h1>
      <h1>{receivingCall}</h1>
      <div className="main-container">
        <div className="video-container">
          <div className="video">
            {stream && (
              <video playsInline muted ref={currentUserVideo} autoPlay />
            )}
            <div className="call-button">
              {callAccepted && !callEnded ? (
                <button onClick={leaveCall}>end call</button>
              ) : (
                <button onClick={() => callUser(location.state.chat._id)}>
                  Call
                </button>
              )}
            </div>
            <div>
              {receivingCall && !callAccepted ? (
                <div className="caller">
                  <h1>{name} is calling...</h1>
                  <button
                    variant="contained"
                    color="primary"
                    onClick={answerCall}
                  >
                    Answer
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
