const express = require("express");

const {
  register,
  login,
  verifyEmail,
  checkOTP,
  updatePassword,
  forgetPassword,
} = require("../controllers/user.controller");
const { AuthMiddleware } = require("../middlewares/auth.middleware");
const { resendOTP } = require("../controllers/user.controller");

const userRouter = express.Router();

// Route to register a new user
userRouter.post("/register", register);

// Route to login a user
userRouter.post("/login", login);

// Route to update password (requires authentication)
userRouter.put("/update-password", AuthMiddleware.authenticate, updatePassword);

// Route to send OTP for forget password
userRouter.post("/forget-password", forgetPassword);

// Route to resend OTP
userRouter.post("/resend-otp", resendOTP);

// Route to verify OTP
userRouter.post("/check-otp", checkOTP);

// Route to verification of email
userRouter.post("/verify-email", verifyEmail);

module.exports = { userRouter };
