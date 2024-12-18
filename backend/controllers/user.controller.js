const { redisClient } = require("../config/redis");
const { SECRET_KEY } = require("../constants");
const { User } = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { sendEmail } = require("../utils/EmailSender");
const {
  generateOTP,
  getStoredOTP,
  removeStoredOTP,
} = require("../utils/OtpGenerator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register a new user
const register = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password) {
      return ApiResponse.error(res, [], 400, "All fields are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return ApiResponse.error(res, [], 409, "Email already in use");
    }

    // Send OTP to User's Email

    const otp = await generateOTP(email);

    const to = email;
    const subject = "Voyawander email verification code";
    const text = `Your OTP is ${otp}`;

    await sendEmail(to, subject, text);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullname,
      email,
      password: hashedPassword,
    });

    await user.save();

    ApiResponse.success(
      res,
      { userId: user._id },
      201,
      "User registered successfully"
    );
  } catch (err) {
    console.error("Error in register:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to register user");
  }
};

// User login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return ApiResponse.error(res, [], 400, "Email and password are required");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return ApiResponse.error(res, [], 404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return ApiResponse.error(res, [], 401, "Invalid credentials");
    }

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, {
      expiresIn: "1h",
    });

    ApiResponse.success(res, { token }, 200, "Login successful");
  } catch (err) {
    console.error("Error in login:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to log in");
  }
};
// Resed OTP to mail
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return ApiResponse.error(res, [], 400, "Email is required");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return ApiResponse.error(res, [], 404, "Email not regiesterd!");
    }

    const otp = await generateOTP(email);

    const to = email;
    const subject = "Voyawander email verification code";
    const text = `Your OTP is ${otp}`;

    const emailStatus = await sendEmail(to, subject, text);

    if (emailStatus) {
      ApiResponse.success(res, {}, 200, "OTP sent successfully");
    } else {
      throw Error;
    }

    // console.log("everythig good ... check email!!");
  } catch (error) {
    console.log(error);
    return ApiResponse.error(res, [], 500, "Something went wrong!");
  }
};

// Check user OTP with Stored OTP
const checkOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log({ email, otp });

    if (!email) {
      return ApiResponse.error(
        res,
        ["Required Email!!!"],
        400,
        "Email is required!"
      );
    }
    if (!otp) {
      return ApiResponse.error(
        res,
        ["Required OTP!!!"],
        400,
        "OTP is required!"
      );
    }

    const storedOTP = await getStoredOTP(email);

    if (!storedOTP) {
      return ApiResponse.error(res, ["OTP expired!"], 404, "OTP expired!");
    }

    if (storedOTP === otp) {
      const user = await User.findOneAndUpdate(
        { email },
        { isVerified: true },
        { new: true }
      );

      if (!user) {
        return ApiResponse.error(
          res,
          ["User not found in Database!"],
          404,
          "User not found!"
        );
      }

      removeStoredOTP(email);
      return ApiResponse.success(res, {}, 200, "Email varified successfuly!");
    } else {
      return ApiResponse.error(
        res,
        ["Expired or Invalid OTP"],
        400,
        "Expired or Invalid OTP"
      );
    }
  } catch (error) {
    console.error("Error while Checking OTP");
    process.exit(1);
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // Validate inputs
    if (!oldPassword || !newPassword) {
      return ApiResponse.error(
        res,
        [],
        400,
        "Old and new passwords are required"
      );
    }

    const userId = req.user.userId; // userId is now in req.user from the authenticate middleware

    console.log({ userId });

    // Fetch user by ID
    const user = await User.findById(userId);
    if (!user) {
      return ApiResponse.error(res, [], 404, "User not found");
    }

    // Verify the old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      return ApiResponse.error(res, [], 401, "Old password is incorrect");
    }

    // Hash and update the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;

    await user.save();

    ApiResponse.success(res, {}, 200, "Password updated successfully");
  } catch (err) {
    console.error("Error in updatePassword:", err);
    ApiResponse.error(res, [err.message], 500, "Failed to update password");
  }
};

// Forget Password (Send OTP)
const forgetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  // step-1 (send OTP in mail)
  if (email && !otp) {
    await resendOTP(req, res);
  }

  //step-2 (verify OTP with stored OTP)
  else if (email && otp && newPassword) {
    try {
      const storedOTP = await getStoredOTP(email);

      if (!storedOTP) {
        return ApiResponse.error(res, ["OTP expired!"], 404, "OTP expired!");
      }

      if (otp === storedOTP) {
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        const user = await User.findOneAndUpdate(
          { email },
          { $set: { password: hashedNewPassword } },
          { new: true }
        );

        if (!user) {
          return ApiResponse.error(
            res,
            ["User not found!"],
            404,
            "User not found!"
          );
        }
      }
      removeStoredOTP(email);
      ApiResponse.success(res, {}, 200, "Password updated successfully");
    } catch (error) {
      return ApiResponse.error(res, [error], 500, error.message);
    }
  } else {
    // send error for missing required details
    return ApiResponse.error(res, [], 409, "Required all details!");
  }
};

module.exports = {
  register,
  login,
  resendOTP,
  checkOTP,
  updatePassword,
  forgetPassword,
};
