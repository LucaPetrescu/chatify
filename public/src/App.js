import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import SetAvatar from "./Pages/SetAvatar";
import Chat from "./Pages/Chat";
import VideoCallPage from "./Pages/VideoCallPage";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/set-avatar" element={<SetAvatar />} />
        <Route path="/" element={<Chat />} />
        <Route path="/video-call" element={<VideoCallPage />} />
      </Routes>
    </BrowserRouter>
  );
}
