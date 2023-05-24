import React from "react";
import Robot from "../assets/robot.gif";

export default function Welcome(props) {
  return (
    <div className="welcome-container">
      <img src={Robot} alt="Robot" />
      <h1>
        {props.currentUser
          ? `Welcome ${props.currentUser.username}`
          : `Welcome`}
      </h1>
      <br></br>
      <h3>Please select a chat to Start messaging.</h3>
    </div>
  );
}
