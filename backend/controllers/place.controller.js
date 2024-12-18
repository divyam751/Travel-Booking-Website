const { Place } = require("../models/place.model");
const { ApiResponse } = require("../utils/ApiResponse");

const addPlaces = async (req, res) => {
  try {
    const places = req.body;

    if (!Array.isArray(places)) {
      return ApiResponse.error(res, [], 400, "Places must be an array");
    }

    if (places.length === 0) {
      return ApiResponse.error(res, [], 400, "At least one place is required");
    }

    const createdPlaces = await Place.insertMany(places);

    ApiResponse.success(res, createdPlaces, 201, "Places added successfully");
  } catch (err) {
    console.error("Error in addPlaces:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to add places");
  }
};

const getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    ApiResponse.success(res, places, 200, "Places fetched successfully");
  } catch (err) {
    console.error("Error in getAllPlaces:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to fetch places");
  }
};

module.exports = { addPlaces, getAllPlaces };
