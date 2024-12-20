// Import necessary modules
const express = require("express");
const {
  addFlights,
  getAllFlights,
} = require("../controllers/flight.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

// Initialize router
const flightRouter = express.Router();

// Define routes

// POST route to add flight data
flightRouter.post(
  "/",
  AuthMiddleware.authenticate,
  AuthMiddleware.authorize(["admin"]),
  addFlights
);

// GET route to retrieve all flights
flightRouter.get("/", getAllFlights);

// Export the router
module.exports = { flightRouter };
