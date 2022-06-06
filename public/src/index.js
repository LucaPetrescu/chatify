import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "./Pages/FormContainer.scss";
import "./Pages/Container.scss";
import "./Pages/ChatPage.scss";
import "./Components/Contacts.scss";
import "./Components/Welcome.scss";
import "./Components/ChatContainer.scss";
import "./Components/LogOut.scss";
import "./Components/ChatInput.scss";
import "./Components/VideoCall.scss";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
