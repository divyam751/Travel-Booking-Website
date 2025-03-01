import React, { useState, useRef, useContext } from "react";
import "./OtpInput.css";
import axios from "axios";
import { useLoading } from "../../context/LoadingContext";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const OtpInput = ({ email, setIsOtpPopupVisible }) => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const inputRefs = useRef([]);
  const { startLoading, stopLoading } = useLoading();
  const [resend, setResend] = useState(false);

  const { updateUser } = useContext(UserContext);
  const { showToast } = useToast();

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
      showToast({ type: "error", message: "OTP must be 6 digits!" });

      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/check-otp`, {
        email,
        otp: otp.join(""),
      });

      if (response.data.status === "success") {
        updateUser({ verified: true });

        showToast({ type: "success", message: "OTP verified successfully!" });

        setOtp(new Array(6).fill(""));
        setIsOtpPopupVisible(false);
      } else {
        showToast({
          type: "error",
          message: response.data.message || "OTP verification failed",
        });

        setResend(true);
      }
    } catch (error) {
      setResend(true);
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during OTP verification",
      });
    } finally {
      stopLoading();
    }
  };

  const handleResend = async (email) => {
    startLoading(); // Indicate loading state
    try {
      // Validate email
      if (!email) {
        showToast({
          type: "error",
          message: "Email is required to resend OTP!",
        });

        stopLoading(); // Stop loading if there's a validation error
        return;
      }

      // Make POST request to resend OTP
      const response = await axios.post(`${API_URL}/users/resend-otp`, {
        email,
      });

      // Check response status and provide feedback
      if (response.data.status === "success") {
        showToast({
          type: "success",
          message: "OTP sent successfully to your email!",
        });
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Failed to resend OTP!",
        });
      }
    } catch (error) {
      // Handle errors gracefully
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while resending OTP",
      });
    } finally {
      stopLoading(); // Stop loading irrespective of success or error
    }
  };

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
