const express = require("express");
const messageRouter = express.Router();
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/message.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

messageRouter.post("/", sendMessage);
messageRouter.get(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  getAllMessages
);

module.exports = { messageRouter };
