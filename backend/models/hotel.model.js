// Import mongoose
const mongoose = require("mongoose");

// Define the hotel schema
const hotelSchema = new mongoose.Schema(
  {
    hotelImage: {
      type: String,
      required: true,
      trim: true,
    },
    hotelStars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    hotelRating: {
      type: String,
      required: true,
      match: /\d\.\d\/5/,
    },
    reviewRating: {
      type: Number,
      required: true,
      min: 0,
    },
    hotelName: {
      type: String,
      required: true,
      trim: true,
    },
    hotelLocation: {
      type: String,
      required: true,
      trim: true,
    },
    hotelDescription: {
      type: String,
      required: true,
      trim: true,
    },
    hotelPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    hotelTax: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

// Create the hotel model
const Hotel = mongoose.model("Hotel", hotelSchema);

// Export the model
module.exports = { Hotel };
