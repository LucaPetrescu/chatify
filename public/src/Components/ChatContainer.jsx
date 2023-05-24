import React, { useState, useEffect, useRef } from "react";
import ChatInput from "./ChatInput";
import LogOut from "./LogOut";
import axios from "axios";
import { sendMessageRoute } from "../Utils/APIRoutes";
import { getAllMessagesRoute } from "../Utils/APIRoutes";
import { BiVideo } from "react-icons/bi";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

export default function ChatContainer(props) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const scrollRef = useRef();

  const navigate = useNavigate();

  useEffect(async () => {
    const data = await JSON.parse(localStorage.getItem("chat-app-user"));

    const response = await axios.post(getAllMessagesRoute, {
      from: data._id,
      to: props.currentChat._id,
    });
    setMessages(response.data);
  }, [props.currentChat]);

  useEffect(() => {
    const getCurrentChat = async () => {
      if (props.currentChat) {
        await JSON.parse(localStorage.getItem("chat-app-user"))._id;
      }
    };
    getCurrentChat();
  }, [props.currentChat]);

  const handleSendMsg = async (msg) => {
    const data = await axios.post(sendMessageRoute, {
      from: props.currentUser._id,
      to: props.currentChat._id,
      message: msg,
    });

    //mesajul se va trimite catre utilizatorul selectat si
    //va fi primit de la utilizatorul curent autentificat
    props.socket.current.emit("send-msg", {
      to: props.currentChat._id,
      from: props.currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({ fromSelf: true, message: msg });
    setMessages(msgs);
  };

  useEffect(() => {
    if (props.socket.current) {
      props.socket.current.on("msg-recieve", (msg) => {
        setArrivalMessage({ fromSelf: false, message: msg });
      });
    }
  }, []);

  useEffect(() => {
    arrivalMessage &&
      setMessages((prev) => {
        return [...prev, arrivalMessage];
      });
  }, [arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  const goToVideoCall = () => {
    navigate("/video-call", {
      state: {
        chat: props.currentChat,
      },
    });
  };

  return (
    <>
      {props.currentChat && (
        <div className="chat-container">
          <div className="chat-header">
            <div className="user-details">
              <div className="avatar">
                <img
                  src={`data:image/svg+xml;base64,${props.currentChat.avatarImage}`}
                  alt="avatar"
                />
              </div>
              <div className="username">
                <h3>{props.currentChat.username}</h3>
              </div>
            </div>
            <div className="video-call-button" onClick={goToVideoCall}>
              <BiVideo />
            </div>
            <LogOut />
          </div>
          <div className="chat-messages">
            {messages.map((message) => {
              return (
                <div ref={scrollRef} key={uuidv4()}>
                  <div
                    className={`message ${
                      message.fromSelf ? "sended" : "recieved"
                    }`}
                  >
                    <div className="content">
                      <p>{message.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <ChatInput handleSendMsg={handleSendMsg} />
        </div>
      )}
    </>
  );
}
