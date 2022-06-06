import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import userValidation from "../Utils/Validation";
import axios from "axios";
import { registerRoute } from "../Utils/APIRoutes";

export default function Register() {
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      const valid = userValidation(values);
      if (valid.error) {
        valid.error.details.forEach((errMsg) => {
          toast.error(errMsg.message, toastOptions);
        });
        return;
      }
      const { username, email, password } = values;
      const { data } = await axios.post(registerRoute, {
        username,
        email,
        password,
      });

      if (data.error) {
        toast.error(data.error, toastOptions);
      }
      if (data.status === true) {
        localStorage.setItem("chat-app-user", JSON.stringify(data.newUser));
        console.log(data);
        navigate("/set-avatar");
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
            <img src={Logo} alt="" />
            <h1>Register</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            value={values.username}
          ></input>
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={(e) => handleChange(e)}
            value={values.email}
          ></input>
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={(e) => handleChange(e)}
            values={values.password}
          ></input>
          <input
            type="password"
            placeholder="Confirm password"
            name="confirmPassword"
            onChange={(e) => handleChange(e)}
            values={values.confirmPassword}
          ></input>
          <button type="submit">Create User</button>
          <span>
            Have an account ?<Link to="/login"> Login </Link>
          </span>
        </form>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
