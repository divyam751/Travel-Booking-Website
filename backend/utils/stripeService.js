const stripe = require("../config/stripe");

const createPaymentIntent = async (amount, currency) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // Amount in smallest currency unit (e.g., 100 for $1.00)
      currency,
    });
    return paymentIntent.client_secret;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createPaymentIntent };
