const { Hotel } = require("../models/hotel.model");
const { ApiResponse } = require("../utils/ApiResponse");
const xss = require("xss");

// Helper function to validate and sanitize a hotel object
const validateHotel = (hotel) => {
  const errors = [];

  const {
    hotelImage,
    hotelStars,
    hotelRating,
    reviewRating,
    hotelName,
    hotelLocation,
    hotelDescription,
    hotelPrice,
    hotelTax,
  } = hotel;

  if (!hotelImage || typeof hotelImage !== "string") {
    errors.push("hotelImage is required and must be a string");
  }

  if (typeof hotelStars !== "number" || hotelStars < 1 || hotelStars > 5) {
    errors.push("hotelStars must be a number between 1 and 5");
  }

  if (!/^\d\.\d\/5$/.test(hotelRating)) {
    errors.push("hotelRating must match the pattern 'X.X/5'");
  }

  if (typeof reviewRating !== "number" || reviewRating < 0) {
    errors.push("reviewRating must be a non-negative number");
  }

  if (!hotelName || typeof hotelName !== "string") {
    errors.push("hotelName is required and must be a string");
  }

  if (!hotelLocation || typeof hotelLocation !== "string") {
    errors.push("hotelLocation is required and must be a string");
  }

  if (!hotelDescription || typeof hotelDescription !== "string") {
    errors.push("hotelDescription is required and must be a string");
  }

  if (typeof hotelPrice !== "number" || hotelPrice < 0) {
    errors.push("hotelPrice must be a non-negative number");
  }

  if (typeof hotelTax !== "number" || hotelTax < 0) {
    errors.push("hotelTax must be a non-negative number");
  }

  return {
    sanitizedHotel: {
      hotelImage: xss(hotelImage),
      hotelStars,
      hotelRating,
      reviewRating,
      hotelName: xss(hotelName),
      hotelLocation: xss(hotelLocation),
      hotelDescription: xss(hotelDescription),
      hotelPrice,
      hotelTax,
    },
    errors,
  };
};

// Create hotels (array of objects)
const createHotels = async (req, res) => {
  try {
    const hotels = req.body;

    // Step 1: Validate input is an array
    if (!Array.isArray(hotels) || hotels.length === 0) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Input should be a non-empty array of hotel objects"
      );
    }

    // Step 2: Validate and sanitize hotels
    const sanitizedHotels = [];
    const errors = [];

    hotels.forEach((hotel, index) => {
      const { sanitizedHotel, errors: validationErrors } = validateHotel(hotel);
      if (validationErrors.length > 0) {
        errors.push({ index, errors: validationErrors });
      } else {
        sanitizedHotels.push(sanitizedHotel);
      }
    });

    // Step 3: Respond with errors if any
    if (errors.length > 0) {
      return ApiResponse.error(
        res,
        errors,
        400,
        "Validation failed for one or more hotel objects"
      );
    }

    // Step 4: Insert sanitized hotels into the database
    const createdHotels = await Hotel.insertMany(sanitizedHotels);
    ApiResponse.success(res, createdHotels, 201, "Hotels created successfully");
  } catch (error) {
    console.error("Error in createHotels:", error);
    ApiResponse.error(res, [error.message], 500, "Failed to create hotels");
  }
};

// Get all hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().sort({ createdAt: -1 });
    ApiResponse.success(res, hotels, 200, "Hotels fetched successfully");
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    ApiResponse.error(res, [error.message], 500, "Failed to fetch hotels");
  }
};

module.exports = { createHotels, getAllHotels };
