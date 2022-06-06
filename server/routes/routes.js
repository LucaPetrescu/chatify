const express = require("express");
const router = express.Router();
const generateJWT = require("../helpers/generateJWT");
const {
  passwordCrypter,
  passwordCheck,
} = require("../helpers/passwordCrypter");
const User = require("../model/userModel");

router.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, email, password } = req.body;
  try {
    const usernameCheck = await User.findOne({ username });
    if (usernameCheck) {
      res.send({ error: "Username already in use", status: false });
    }
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      res.send({ error: "Email already in use", status: false });
    }
    const hashedPassword = passwordCrypter(password);

    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    const accessToken = generateJWT.accessToken(newUser.id, newUser.username);
    const refreshToken = generateJWT.refreshToken(newUser.id, newUser.username);
    res.send({
      message: "Register successful",
      status: true,
      accessToken: accessToken,
      refreshToken: refreshToken,
      newUser,
    });
  } catch (err) {
    res.status(500);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user)
      res.send({
        error: "Incorrect username or password",
        status: false,
      });
    const isValidPassword = passwordCheck(password, user.password);
    if (!isValidPassword)
      res.send({
        error: "Incorrect username or password",
        status: false,
      });
    const accessToken = generateJWT.accessToken(user.id, user.username);
    const refreshToken = generateJWT.refreshToken(user.id, user.username);
    res.send({
      message: "Logged in!",
      status: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500);
  }
});

router.post("/set-avatar", async (req, res) => {
  try {
    const { user, image } = req.body;
    const userData = await User.findByIdAndUpdate(
      user._id,
      {
        isAvatarImageSet: true,
        avatarImage: image,
      },
      {
        new: true,
      }
    );
    res.send({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (err) {
    res.status(500);
  }
});

router.post("/access-token", async (req, res) => {
  // const { accessToken } = req.body;
  // const isOk = generateJWT.verifyAccessToken(accessToken);
  const { test } = req.body;
  res.send(test);
});

router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  const isOk = generateJWT.verifyRefreshToken(refreshToken);
  res.send({ isOk });
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find({}).select("email username avatarImage _id");
    res.send(users);
  } catch (err) {
    res.status(500);
  }
});

module.exports = router;
