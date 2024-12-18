const express = require("express");
const placeRouter = express.Router();
const { addPlaces, getAllPlaces } = require("../controllers/place.controller");

placeRouter.post("/", addPlaces);
placeRouter.get("/", getAllPlaces);

module.exports = { placeRouter };
