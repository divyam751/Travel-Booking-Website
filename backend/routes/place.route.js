const express = require("express");
const placeRouter = express.Router();
const { addPlaces, getAllPlaces } = require("../controllers/place.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

placeRouter.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  addPlaces
);
placeRouter.get("/", getAllPlaces);

module.exports = { placeRouter };
