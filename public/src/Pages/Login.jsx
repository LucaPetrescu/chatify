import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginRoute, verifyAccessTokenRoute } from "../Utils/APIRoutes";

export default function Login() {
  const [values, setValues] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
  };

  useEffect(() => {
    if (localStorage.getItem("chat-app-user")) {
      navigate("/");
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { username, password } = values;
      const { data } = await axios.post(loginRoute, {
        username,
        password,
      });

      const accessToken = data.accessToken;
      const refreshToken = data.refreshToken;

      if (data.error) {
        toast.error(data.error, toastOptions);
      }

      const { checkAccessToken } = await axios.post(verifyAccessTokenRoute, {
        accessToken,
      });

      console.log(checkAccessToken);

      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.user));
        navigate("/");
      }
    } catch (error) {
      toast.error(error, toastOptions);
    }
  };

  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <>
      <div className="form-container">
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src={Logo} alt="logo" />
            <h1>Login</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
          ></input>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
          ></input>
          <button type="submit">Log in</button>
          <span>
            Don't have an account ? <Link to="/register">Create one</Link>
          </span>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
