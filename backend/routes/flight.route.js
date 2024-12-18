// Import necessary modules
const express = require("express");
const {
  addFlights,
  getAllFlights,
} = require("../controllers/flight.controller");

// Initialize router
const flightRouter = express.Router();

// Define routes

// POST route to add flight data
flightRouter.post("/", addFlights);

// GET route to retrieve all flights
flightRouter.get("/", getAllFlights);

// Export the router
module.exports = { flightRouter };
