const otpGenerator = require("otp-generator");
const { redisClient } = require("../config/redis");
const { OTP_VALID_TIME } = require("../constants");

const generateOTP = async (email) => {
  try {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    await storeOTP(email, otp);

    return otp;
  } catch (error) {
    console.error("Error while generating OTP!!");
    process.exit(1);
  }
};

const storeOTP = async (email, otp) => {
  try {
    await redisClient.setEx(email, OTP_VALID_TIME, otp);
    console.log("OTP successfuly stored in Redis!");
  } catch (error) {
    console.error("Error while storing OTP in Redis cloud!!");
  }
};

const getStoredOTP = async (email) => {
  try {
    const storedOTP = await redisClient.get(email);
    return storedOTP;
  } catch (error) {
    console.error("Error while getting stored OTP!!");
  }
};

const removeStoredOTP = async (email) => {
  try {
    const result = await redisClient.del(email);
    if (result) {
      console.log("OTP successfully removed from Redis!");
    } else {
      console.log("No OTP found for the provided email to remove.");
    }
  } catch (error) {
    console.error("Error while removing OTP from Redis!");
  }
};

module.exports = { generateOTP, getStoredOTP, removeStoredOTP };
