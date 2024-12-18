const { createPaymentIntent } = require("../utils/stripeService");

const createPayment = async (req, res) => {
  const { amount, currency } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ error: "Amount and currency are required" });
  }

  try {
    const clientSecret = await createPaymentIntent(amount, currency);
    res.status(200).json({ clientSecret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createPayment };
