const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const bookingSchema = new Schema(
  {
    traveller: {
      name: {
        type: String,
        required: [true, "Traveller name is required"],
        trim: true,
        minlength: [3, "Name must be at least 3 characters long"],
        maxlength: [50, "Name cannot exceed 50 characters"],
      },
      age: {
        type: Number,
        required: [true, "Age is required"],
        min: [0, "Age must be greater than or equal to 0"],
        max: [99, "Age must be less than or equal to 99"],
      },
      gender: {
        type: String,
        required: [true, "Gender is required"],
        enum: ["Male", "Female", "Other"],
        trim: true,
      },
      adharNumber: {
        type: String,
        required: [true, "Aadhar number is required"],
        match: [/^\d{12}$/, "Aadhar number must be a valid 12-digit number"],
      },
      address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
        minlength: [5, "Address must be at least 5 characters long"],
      },
    },
    holiday: {
      place: {
        type: String,
        required: [true, "Place name is required"],
        trim: true,
      },
      hotel: {
        type: String,
        required: [true, "Hotel name is required"],
        trim: true,
      },
      flight: {
        type: String,
        required: [true, "Flight name is required"],
        trim: true,
      },
      departure: {
        type: String,
        required: [true, "Departure time is required"],
        trim: true,
      },
      arrival: {
        type: String,
        required: [true, "Arrival time is required"],
        trim: true,
      },
    },
    payment: {
      trip: {
        type: Number,
        required: [true, "Trip payment is required"],
        min: [0, "Amount must be at least 0"],
      },
      hotel: {
        type: Number,
        required: [true, "Hotel payment is required"],
        min: [0, "Amount must be at least 0"],
      },
      flight: {
        type: Number,
        required: [true, "Flight payment is required"],
        min: [0, "Amount must be at least 0"],
      },
      traveller: {
        type: Number,
        required: [true, "Number of travellers is required"],
        min: [1, "At least 1 traveller is required"],
      },
      totalAmount: {
        type: Number,
        required: [true, "Total payment amount is required"],
        min: [0, "Amount must be at least 0"],
      },
    },
    paid: {
      type: Boolean,
      required: [true, "Paid status is required"],
      default: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create and export the Booking model
const Booking = model("Booking", bookingSchema);

module.exports = { Booking };
