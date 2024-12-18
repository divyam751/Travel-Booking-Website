// booking.route.js
const express = require("express");
const {
  createBooking,
  getTotalAmount,
  saveBookingDetails,
} = require("../controllers/booking.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");

const bookingRouter = express.Router();

bookingRouter.post("/create", createBooking);
bookingRouter.post("/total-amount", getTotalAmount);
bookingRouter.post(
  "/save-booking",
  AuthMiddleware.authenticate,
  saveBookingDetails
);

module.exports = { bookingRouter };
