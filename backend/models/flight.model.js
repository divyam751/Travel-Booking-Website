// Import mongoose
const mongoose = require("mongoose");

// Define the flight schema
const flightSchema = new mongoose.Schema(
  {
    flightLogo: {
      type: String,
      required: true,
      trim: true,
    },
    flightName: {
      type: String,
      required: true,
      trim: true,
    },
    flightNumber: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: String,
      required: true,
      trim: true,
    },
    departureDestination: {
      type: String,
      required: true,
      trim: true,
    },
    arrivalTime: {
      type: String,
      required: true,
      trim: true,
    },
    totalTime: {
      type: String,
      required: true,
      trim: true,
    },
    flightPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create the Flight model
const Flight = mongoose.model("Flight", flightSchema);

module.exports = { Flight };
