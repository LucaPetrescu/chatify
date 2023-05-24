const express = require("express");
const router = express.Router();

const messageModel = require("../model/messageModel");

router.post("/addmsg", async (req, res) => {
  try {
    const { from, to, message } = req.body;
    const data = await messageModel.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) {
      res.send({ msg: "Added message to the database" });
    } else {
      res.send({ msg: "Failed to add message" });
    }
  } catch (err) {
    res.status(500).send({ msg: err.message });
  }
});

router.post("/getmsg", async (req, res) => {
  const { from, to } = req.body;
  const messages = await messageModel
    .find({
      users: {
        $all: [from, to],
      },
    })
    .sort({ updatedAt: 1 });
  const projectedMessages = messages.map((msg) => {
    return {
      fromSelf: msg.sender.toString() === from,
      message: msg.message.text,
    };
  });

  res.send(projectedMessages);
});

router.post("/delete-all-messages", async (req, res) => {
  try {
    await messageModel.remove();
    res.send("All messages removed");
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
