const express = require("express");
const messageRouter = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/message.controller");

messageRouter.post("/", sendMessage);
messageRouter.get("/", getAllMessages);

module.exports = { messageRouter };
