import React, { useState, useEffect } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { setAvatarRoute } from "../Utils/APIRoutes";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com/45678945";
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [randomAvatars, setRandomAvatars] = useState(undefined);

  const toastOptions = {
    position: "bottom-right",
    autoClose: 8000,
  };

  useEffect(() => {
    if (!localStorage.getItem("chat-app-user")) {
      navigate("/login");
    }
  }, []);

  const setProfilePicture = async () => {
    if (selectedAvatar === undefined) {
      toast.error("Please select a profile picture", toastOptions);
    } else {
      const user = await JSON.parse(localStorage.getItem("chat-app-user"));
      const { data } = await axios.post(setAvatarRoute, {
        user,
        image: avatars[selectedAvatar],
      });
      if (data.isSet) {
        console.log(data.image);
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem("chat-app-user", JSON.stringify(user));
        navigate("/");
      } else {
        toast.error("An error occurred while setting up avatar", toastOptions);
      }
    }
  };

  useEffect(() => {
    async function getAllAvatars() {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${api}/${Math.round(Math.random() * 1000)}`
        );
        const buffer = new Buffer(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    }
    getAllAvatars();
    console.log("done");
  }, [randomAvatars]);

  return (
    <>
      {isLoading ? (
        <div className="container">
          <img src={loader} alt="loader" className="loader"></img>
        </div>
      ) : (
        <div className="container">
          <div className="title-container">
            <h1>Pick your avatar as your profile</h1>
          </div>
          <div className="avatars">
            {avatars.map((avatar, index) => {
              return (
                <div
                  className={`avatar ${
                    selectedAvatar === index ? "selected" : ""
                  }`}
                >
                  <img
                    key={avatar}
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </div>
              );
            })}
          </div>
          <button
            className="submit-btn"
            onClick={() => {
              setProfilePicture();
            }}
          >
            Set profile picture
          </button>
          <button
            className="refresh-btn"
            onClick={() => {
              setIsLoading(true);
              setRandomAvatars(Math.round(Math.random() * 1000));
            }}
          >
            Refresh avatars
          </button>
        </div>
      )}
      <ToastContainer></ToastContainer>
    </>
  );
}
