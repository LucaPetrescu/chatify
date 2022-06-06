import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { allUsersRoute, host } from "../Utils/APIRoutes";
import { useNavigate } from "react-router-dom";
import Contacts from "../Components/Contacts";
import Welcome from "../Components/Welcome";
import ChatContainer from "../Components/ChatContainer";
import { io } from "socket.io-client";

export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [recievingCall, setRecievingCall] = useState(false);

  useEffect(() => {
    async function checkLocalStorage() {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(await JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    }
    checkLocalStorage();
  }, []);

  //imediat ce pagina s-a incarcat, adauga noul utilizator (id-ul)
  //fa legatura cu ce e in backend
  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      //functie responsabila cu efectuarea apelului video
      socket.current.on("call-user", (data) => {
        setRecievingCall(data.isCalling);
        console.log("aici", data.isCalling);
      });
    }
    console.log(recievingCall);
  }, [currentUser]);

  useEffect(() => {
    async function getAllContacts() {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
          const contacts = await axios.get(allUsersRoute);
          setContacts(contacts.data);
        } else {
          navigate("/set-avatar");
        }
      }
    }
    getAllContacts();
  }, [currentUser]);

  if (recievingCall) {
    navigate("/video-call");
  }

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <>
      <div className="chat-page">
        <div className="container">
          <Contacts
            contacts={contacts}
            currentUser={currentUser}
            changeChat={handleChatChange}
          ></Contacts>
          {isLoaded && currentChat === undefined ? (
            <Welcome currentUser={currentUser}></Welcome>
          ) : (
            <ChatContainer
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
            ></ChatContainer>
          )}
        </div>
      </div>
    </>
  );
}
