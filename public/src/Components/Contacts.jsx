import React, { useState, useEffect } from "react";
import Logo from "../assets/logo.png";

export default function Contacts(props) {
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);
  const [currentSelected, setCurrentSelected] = useState(undefined);

  useEffect(() => {
    if (props.currentUser) {
      setCurrentUserImage(props.currentUser.avatarImage);
      setCurrentUserName(props.currentUser.username);
    }
  }, [props.currentUser]);

  const changeCurrentChat = (index, contact) => {
    setCurrentSelected(index);
    props.changeChat(contact);
  };

  return (
    <>
      {currentUserImage && currentUserImage && (
        <div className="contacts-container">
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h3>Contacts</h3>
          </div>
          <div className="contacts">
            {props.contacts.map((contact, index) => {
              return (
                <div
                  key={contact._id}
                  className={`contact ${
                    index === currentSelected ? "selected" : ""
                  }`}
                  onClick={() => changeCurrentChat(index, contact)}
                >
                  <div className="avatar">
                    <img
                      src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                      alt="avatar"
                    />
                  </div>
                  <div className="username">
                    <h3>{contact.username}</h3>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="current-user">
            <div className="avatar">
              <img
                src={`data:image/svg+xml;base64,${currentUserImage}`}
                alt="avatar"
              />
            </div>
            <div className="username">
              <h2>{currentUserName}</h2>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
