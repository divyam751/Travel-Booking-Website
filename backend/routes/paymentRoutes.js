const express = require("express");
const { createPayment } = require("../controllers/paymentController");

const paymentRouter = express.Router();

// Route to create a payment intent
paymentRouter.post("/create-payment-intent", createPayment);

module.exports = { paymentRouter };
