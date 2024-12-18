const express = require("express");

const {
  register,
  login,
  verifyEmail,
  checkOTP,
  updatePassword,
  forgetPassword,
  resetPassword,
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

// Route to reset password using OTP
// userRouter.post("/reset-password", resetPassword);

// My other routes check

userRouter.post("/resend-otp", resendOTP);
userRouter.post("/check-otp", checkOTP);

module.exports = { userRouter };
