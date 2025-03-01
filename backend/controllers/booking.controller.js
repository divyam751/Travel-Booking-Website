const { v4: uuidv4 } = require("uuid");
const { redisClient } = require("../config/redis");
const { Place } = require("../models/place.model");
const { Hotel } = require("../models/hotel.model");
const { Flight } = require("../models/flight.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { Booking } = require("../models/booking.model");
const { sendTickets } = require("../utils/TicketSender");
const xss = require("xss");
const validator = require("validator");

// Controller function to handle booking

const createBooking = async (req, res) => {
  try {
    // Extract and sanitize data from request body
    let {
      place,
      hotel,
      flight,
      fullName,
      age,
      gender,
      address,
      adharNumber,
      numOfTickets,
    } = req.body;

    // Sanitize inputs to prevent XSS attacks
    fullName = xss(fullName);
    address = xss(address);
    gender = xss(gender);
    adharNumber = xss(adharNumber);

    // Validate inputs
    if (!fullName || !validator.isLength(fullName, { min: 3, max: 50 })) {
      return ApiResponse.error(res, [], 400, "Invalid full name");
    }
    if (!age || !validator.isInt(age.toString(), { min: 0, max: 99 })) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Age must be a valid number between 0 and 99"
      );
    }
    if (!gender || !["Male", "Female", "Other"].includes(gender)) {
      return ApiResponse.error(res, [], 400, "Invalid gender");
    }
    if (!adharNumber || !validator.matches(adharNumber, /^\d{12}$/)) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Aadhar number must be a valid 12-digit number"
      );
    }
    if (!address || !validator.isLength(address, { min: 5 })) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Address must be at least 5 characters long"
      );
    }
    if (!place || !hotel || !flight || !numOfTickets) {
      return ApiResponse.error(res, [], 400, "Missing required fields");
    }

    // Generate unique transaction ID
    const transactionId = uuidv4();

    // Fetch place, hotel, and flight details from the database
    const placeDetails = await Place.findById(place);
    const hotelDetails = await Hotel.findById(hotel);
    const flightDetails = await Flight.findById(flight);

    if (!placeDetails || !hotelDetails || !flightDetails) {
      return ApiResponse.error(
        res,
        [],
        404,
        "Place, hotel, or flight not found"
      );
    }

    // Calculate total amount
    const totalAmount =
      (placeDetails.price +
        hotelDetails.hotelPrice +
        flightDetails.flightPrice) *
      numOfTickets;

    // Create the booking details object
    const bookingDetails = {
      traveller: {
        name: fullName,
        age: parseInt(age),
        gender,
        adharNumber,
        address,
      },
      holiday: {
        place: placeDetails.placeName,
        hotel: hotelDetails.hotelName,
        flight: flightDetails.flightName,
        departure: flightDetails.departureTime,
        arrival: flightDetails.arrivalTime,
      },
      payment: {
        trip: placeDetails.price,
        hotel: hotelDetails.hotelPrice,
        flight: flightDetails.flightPrice,
        traveller: numOfTickets,
        totalAmount,
      },
    };

    // Save the booking data in Redis with the transaction ID as key
    await redisClient.setEx(transactionId, 900, JSON.stringify(bookingDetails)); // 15 min expiration

    // Respond with the transaction ID and total amount
    const responseData = {
      transactionId,
      totalAmount,
    };
    return ApiResponse.success(res, responseData);
  } catch (error) {
    console.error(error);
    return ApiResponse.error(
      res,
      [],
      500,
      "An error occurred while creating booking"
    );
  }
};

const getTotalAmount = async (req, res) => {
  try {
    const { transactionId } = req.body;

    if (!transactionId) {
      return ApiResponse.error(
        res,
        ["transactionId is required"],
        401,
        "transactionID is required"
      );
    }

    const storedData = await redisClient.get(transactionId);

    if (!storedData) {
      return ApiResponse.error(
        res,
        ["transactionId is expired"],
        401,
        "transactionId is expired"
      );
    }

    const details = await JSON.parse(storedData);

    const totalAmount = details?.payment?.totalAmount;

    return ApiResponse.success(
      res,
      { totalAmount },
      200,
      "Amount fethced successfuly!"
    );
  } catch (error) {
    console.log(error);
    return ApiResponse.error(
      res,
      [error.message],
      500,
      "something went wrong during getting total amount"
    );
  }
};

const saveBookingDetails = async (req, res) => {
  try {
    const { transactionId, paid } = req.body;

    // Validate request parameters
    if (!transactionId) {
      return ApiResponse.error(
        res,
        ["Transaction ID is required"],
        400,
        "Transaction ID is required"
      );
    }
    if (typeof paid !== "boolean") {
      return ApiResponse.error(
        res,
        ["Paid status must be true or false"],
        400,
        "Paid status is required"
      );
    }

    // Retrieve data from Redis using the transactionId
    const storedData = await redisClient.get(transactionId);

    if (!storedData) {
      return ApiResponse.error(
        res,
        ["Transaction ID has expired or is invalid"],
        404,
        "Transaction ID not found"
      );
    }

    const bookingDetails = JSON.parse(storedData);

    // Prepare data to save in the Booking model
    const newBooking = new Booking({
      traveller: bookingDetails.traveller,
      holiday: bookingDetails.holiday,
      payment: bookingDetails.payment,
      paid: paid,
      userId: req.user.userId,
    });

    // Save the booking details in the database
    await newBooking.save();

    // Send Email
    const data = {
      traveller: {
        "Traveller Name": bookingDetails.traveller.name,
        Age: bookingDetails.traveller.age,
        Gender: bookingDetails.traveller.gender,
        "Aadhar Number": bookingDetails.traveller.adharNumber,
        Address: bookingDetails.traveller.address,
      },
      holiday: {
        "Holiday Place": bookingDetails.holiday.place,
        Hotel: bookingDetails.holiday.hotel,
        Flight: bookingDetails.holiday.flight,
        "Departure Time": bookingDetails.holiday.departure,
        "Arrival Time": bookingDetails.holiday.arrival,
      },
      payment: {
        "Trip Payment": `$ ${bookingDetails.payment.trip}`,
        "Hotel Payment": `$ ${bookingDetails.payment.hotel}`,
        "Flight Payment": `$ ${bookingDetails.payment.flight}`,
        "Number of Travellers": `${bookingDetails.payment.traveller}`,
        "Total Amount": `$ ${bookingDetails.payment.totalAmount}`,
      },
    };

    await sendTickets({
      userId: req.user.userId,
      data: data,
      bookingId: newBooking._id,
    });

    // Remove the transaction data from Redis after successful save
    await redisClient.del(transactionId);

    // Send a success response
    return ApiResponse.success(
      res,
      { bookingId: newBooking._id, message: "Booking saved successfully" },
      201,
      "Booking details saved successfully"
    );
  } catch (error) {
    console.error("Error saving booking details:", error);
    return ApiResponse.error(
      res,
      [error.message],
      500,
      "Something went wrong while saving booking details"
    );
  }
};

module.exports = { createBooking, getTotalAmount, saveBookingDetails };
