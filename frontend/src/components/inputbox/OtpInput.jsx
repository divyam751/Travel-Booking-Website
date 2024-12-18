import React, { useState, useRef } from "react";
import "./OtpInput.css";
import axios from "axios";
import { useLoading } from "../../context/LoadingContext";
import { useNavigate } from "react-router";

const OtpInput = ({ setToastData, email, setIsOtpPopupVisible, nextRoute }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const { startLoading, stopLoading } = useLoading();
  const [resend, setResend] = useState(false);

  const navigate = useNavigate();

  const handleChange = (element, index) => {
    const value = element.value.slice(-1); // Allow only the last digit
    if (/^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to the next input box
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[index] === "") {
        // Move focus to the previous input box if empty
        if (index > 0) {
          inputRefs.current[index - 1].focus();
        }
      } else {
        newOtp[index] = ""; // Clear the current box
      }
      setOtp(newOtp);
    }
  };

  const handleOtpSubmit = async (e) => {
    startLoading();
    e.preventDefault();

    if (otp.join("").length < 6) {
      console.log("hereeee");
      const trigger = Date.now();
      setToastData({
        type: "error",
        message: "OTP must be 6 digits!",
        trigger: trigger.toString(),
      });
      console.log({ trigger });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/check-otp",
        {
          email,
          otp: otp.join(""),
        }
      );

      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: "OTP verified successfully!",
        });
        setOtp(new Array(6).fill(""));
        setIsOtpPopupVisible(false);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "OTP verification failed",
          trigger: Date.now(),
        });
        setResend(true);
      }
    } catch (error) {
      setResend(true);
      console.log({ error });
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during OTP verification",
        trigger: Date.now(),
      });
    } finally {
      stopLoading();
      setTimeout(() => {
        navigate(nextRoute);
      }, 3000);
    }
  };

  const handleResend = async (email) => {
    startLoading(); // Indicate loading state
    try {
      // Validate email
      if (!email) {
        setToastData({
          type: "error",
          message: "Email is required to resend OTP!",
          trigger: Date.now(),
        });
        stopLoading(); // Stop loading if there's a validation error
        return;
      }

      // Make POST request to resend OTP
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/resend-otp",
        { email }
      );

      // Check response status and provide feedback
      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: "OTP sent successfully to your email!",
          trigger: Date.now(),
        });
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Failed to resend OTP!",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      // Handle errors gracefully
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while resending OTP",
        trigger: Date.now(),
      });
    } finally {
      stopLoading(); // Stop loading irrespective of success or error
    }
  };

  // email = "mi.divyam@gmail.com";

  return (
    <div className="otp-popup">
      <p className="otp-title">
        An OTP sent on <span className="otp-title__email">{email} </span>
      </p>
      <h2>Enter OTP</h2>
      <form onSubmit={handleOtpSubmit}>
        <div className="otp-inputs">
          {otp?.map((digit, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              ref={(el) => (inputRefs.current[index] = el)}
              className="otp-box"
            />
          ))}
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
        {resend && (
          <p className="otp-resendBtn" onClick={() => handleResend(email)}>
            Resend OTP
          </p>
        )}
      </form>
    </div>
  );
};

export default OtpInput;
