import React, { useState } from "react";
import Picker from "emoji-picker-react";
import { IoMdSend } from "react-icons/io";
import { BsEmojiSmileFill } from "react-icons/bs";

export default function ChatInput(props) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEmojiPickerOnOff = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleOnEmojiPick = (event, emojiObject) => {
    let message = msg;
    message += emojiObject.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      props.handleSendMsg(msg);
    }
    setMsg("");
  };

  return (
    <div className="chat-input">
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerOnOff} />
          {showEmojiPicker && <Picker onEmojiClick={handleOnEmojiPick} />}
        </div>
      </div>
      <form className="input-container" onSubmit={(e) => sendChat(e)}>
        <input
          type="text"
          placeholder="Type..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        ></input>
        <button className="submit">
          <IoMdSend />
        </button>
      </form>
    </div>
  );
}
