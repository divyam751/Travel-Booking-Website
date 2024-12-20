// routes/hotel.route.js
const express = require("express");
const {
  createHotels,
  getAllHotels,
} = require("../controllers/hotel.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

const hotelRouter = express.Router();

// POST route to create multiple hotels
hotelRouter.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  createHotels
);

// GET route to fetch all hotels
hotelRouter.get("/", getAllHotels);

module.exports = { hotelRouter };
