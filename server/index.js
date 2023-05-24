const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const db = require("./helpers/keys").MongoURI;
const routes = require("./routes/routes");
const messagesRoutes = require("./routes/messagesRoutes");
const socket = require("socket.io");
require("dotenv").config();

const whitelist = ["http://localhost:3000", "https://chatifyapp.onrender.com"];

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// };

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://chatifyapp-frontend.onrender.com",
    ],
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());

app.use("/", routes);
app.use("/", messagesRoutes);

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log("Mongoose Connected");
  })
  .catch((err) => {
    console.log(err);
  });

const server = app.listen(process.env.PORT || 5000, () => {
  console.log(`Server listening on ${process.env.PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "https://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  //conexiune pentru fiecare user

  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.emit("current-user", socket.id);

  console.log(onlineUsers);

  socket.on("send-msg", (data) => {
    //va primi request-ul din frontend si va
    //extrage cui trebuie trimis mesajul
    const sendUserSocket = data.to;
    //se va selecta id-ul socket-ului utilizatorului in
    //functie de id-ul din baza de date
    const sendTo = onlineUsers.get(sendUserSocket);
    if (sendUserSocket) {
      //mesajul va fi trimis catre user-ul
      //cu socket id-ul respectiv
      socket.to(sendTo).emit("msg-recieve", data.message);
    }
  });

  socket.on("call-user", (data) => {
    const callReciever = data.userToCall;
    const callTo = onlineUsers.get(callReciever);
    socket.to(callTo).emit("call-user", {
      signal: data.signalData,
      from: data.from,
      name: data.name,
      isCalling: true,
    });
    console.log("here", callTo);
  });

  socket.on("answer-call", (data) => {
    const answerTo = data.to;
    socket.to(answerTo).emit("call-accepted", data.signal);
  });
});
