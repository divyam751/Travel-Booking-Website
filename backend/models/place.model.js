const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    imageURL: {
      type: String,
      required: true,
      trim: true,
    },
    placeName: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    tripDuration: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Place = mongoose.model("Place", placeSchema);

module.exports = { Place };
