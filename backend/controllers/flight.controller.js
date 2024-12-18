// Import necessary modules
const validator = require("validator");
const xss = require("xss");
const { Flight } = require("../models/flight.model");
const { ApiResponse } = require("../utils/ApiResponse");

// Controller for handling flight data

// POST request handler to add flight data (array of objects)
const addFlights = async (req, res) => {
  try {
    const flights = req.body;

    if (!Array.isArray(flights) || flights.length === 0) {
      return ApiResponse.error(
        res,
        ["Invalid data format. Expected an array of objects."],
        400,
        "Validation Error"
      );
    }

    // Sanitize and validate each flight object
    const sanitizedFlights = flights.map((flight) => {
      return {
        flightLogo: xss(flight.flightLogo),
        flightName: xss(flight.flightName),
        flightNumber: xss(flight.flightNumber),
        departureTime: xss(flight.departureTime),
        departureDestination: xss(flight.departureDestination),
        arrivalTime: xss(flight.arrivalTime),
        totalTime: xss(flight.totalTime),
        flightPrice: validator.isNumeric(String(flight.flightPrice))
          ? Number(flight.flightPrice)
          : 0,
      };
    });

    // Insert flights into the database
    const createdFlights = await Flight.insertMany(sanitizedFlights);

    return ApiResponse.success(
      res,
      createdFlights,
      201,
      "Flights added successfully"
    );
  } catch (error) {
    console.error("Error adding flights:", error);
    return ApiResponse.error(
      res,
      [error.message],
      500,
      "Failed to add flights"
    );
  }
};

// GET request handler to fetch all flights
const getAllFlights = async (req, res) => {
  try {
    const flights = await Flight.find();

    if (!flights || flights.length === 0) {
      return ApiResponse.success(res, [], 200, "No flights found");
    }

    return ApiResponse.success(
      res,
      flights,
      200,
      "Flights retrieved successfully"
    );
  } catch (error) {
    console.error("Error retrieving flights:", error);
    return ApiResponse.error(
      res,
      [error.message],
      500,
      "Failed to retrieve flights"
    );
  }
};

module.exports = { addFlights, getAllFlights };
