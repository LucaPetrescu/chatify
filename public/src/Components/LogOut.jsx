import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BiPowerOff } from "react-icons/bi";
export default function LogOut(props) {
  const navigate = useNavigate();
  const handleClick = async () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="log-out-button" onClick={handleClick}>
      <BiPowerOff />
    </div>
  );
}
