const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    mobile: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 10,
    },
    message: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = { Message };
