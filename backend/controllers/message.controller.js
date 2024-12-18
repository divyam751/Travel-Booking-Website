const { Message } = require("../models/message.model");
const { ApiResponse } = require("../utils/ApiResponse");
const validator = require("validator");
const xss = require("xss");

const sendMessage = async (req, res) => {
  try {
    const { email, mobile, message } = req.body;

    // Step 1: Validate that all required fields are present
    if (!email || !mobile || !message) {
      return ApiResponse.error(res, [], 400, "All fields are required");
    }

    // Step 2: Validate Email
    if (!validator.isEmail(email)) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Please enter a valid email address"
      );
    }

    // Step 3: Validate Mobile Number
    if (!/^\d{10}$/.test(mobile)) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Mobile number must be exactly 10 digits"
      );
    }

    // Step 4: Validate Message Length
    const messageLength = message.trim().length;
    if (messageLength < 10 || messageLength > 500) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Message must be between 10 and 500 characters"
      );
    }

    // Step 5: Sanitize message to prevent XSS (Remove HTML tags, scripts, etc.)
    const sanitizedMessage = xss(message);

    // Step 6: Check for malicious links or keywords
    const forbiddenPatterns = [
      /http[s]?:\/\/[\S]+/, // Match HTTP URLs (malicious links)
      /<script.*?>.*?<\/script>/i, // Match script tags
      /<.*?on\w*=".*?"/i, // Match inline event handlers (like onClick, onLoad)
    ];

    for (let pattern of forbiddenPatterns) {
      if (pattern.test(sanitizedMessage)) {
        return ApiResponse.error(
          res,
          [],
          400,
          "Malicious content detected in message"
        );
      }
    }

    // Step 7: Create the message and save it to the database
    const newMessage = new Message({
      email,
      mobile,
      message: sanitizedMessage, // Save the sanitized message
    });

    await newMessage.save();

    ApiResponse.success(
      res,
      { messageId: newMessage._id },
      200,
      "Message sent successfully"
    );
  } catch (err) {
    console.error("Error in sendMessage:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to send message");
  }
};

const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    ApiResponse.success(res, messages, 200, "Messages fetched successfully");
  } catch (err) {
    console.error("Error in getAllMessages:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to fetch messages");
  }
};

module.exports = { sendMessage, getAllMessages };
