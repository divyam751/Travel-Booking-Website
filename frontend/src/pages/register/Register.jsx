import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Register.css";
import InputBox from "../../components/inputbox/InputBox";
import Toast from "../../utils/Toast";
import logo from "../../assets/images/logo.webp";
import Restriction from "../../utils/Restriction";
import OtpInput from "../../components/inputbox/OtpInput";
import { useLoading } from "../../context/LoadingContext";
import { useNavigate } from "react-router";
import { API_URL } from "../../constant";

const Register = () => {
  const { startLoading, stopLoading } = useLoading();
  const [email, setEmail] = useState(""); // Retrieve email from session storage if available
  const [otp, setOtp] = useState("");
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    password: "",
  });

  const [toastData, setToastData] = useState({
    type: null,
    message: "",
    trigger: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateEmail = () => {
    if (!email) {
      return "Email is required!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address!";
    }
    return null;
  };

  const validateForm = () => {
    const { fullname, password } = formData;
    if (!fullname || !password) {
      return "Full Name and Password are required!";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long!";
    }
    return null;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    startLoading();

    const validationError = validateEmail();
    if (validationError) {
      setToastData({
        type: "error",
        message: validationError,
        trigger: Date.now(),
      });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/verify-email`, {
        email,
      });

      if (response.data.status === "success") {
        sessionStorage.setItem("email", email); // Save email in session storage
        setIsEmailVerified(true);
        setIsOtpPopupVisible(true);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Email verification failed",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while sending OTP",
        trigger: Date.now(),
      });
    } finally {
      stopLoading();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    startLoading();

    const validationError = validateForm();
    if (validationError) {
      setToastData({
        type: "error",
        message: validationError,
        trigger: Date.now(),
      });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/register`, {
        fullname: formData.fullname,
        email,
        password: formData.password,
      });

      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: response.data.message,
          trigger: Date.now(),
        });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Registration failed",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during registration",
        trigger: Date.now(),
      });
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setEmail(sessionStorage.getItem("email"));
      setIsEmailVerified(true);
    }
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <div className="register-container">
      <div className="register-formParent">
        <img src={logo} alt="logo" className="register-companyLogo" />
        <span className="register-companySlogan">
          Your ultimate travel companion!{" "}
        </span>
        {
          <form className="register-form" onSubmit={handleSendOtp}>
            <InputBox
              type="email"
              name="email"
              label="Email"
              value={email}
              width="400px"
              onChange={(e) => setEmail(e.target.value)}
              isDisabled={isOtpPopupVisible || isEmailVerified}
            />
            {!isEmailVerified && (
              <button type="submit" className="submit-button">
                Send OTP
              </button>
            )}
          </form>
        }
        <br />
        {isEmailVerified && (
          <form className="register-form" onSubmit={handleRegister}>
            <InputBox
              type="text"
              name="fullname"
              label="Full Name"
              value={formData.fullname}
              width="400px"
              onChange={handleInputChange}
              isDisabled={!isEmailVerified}
            />
            <InputBox
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              width="400px"
              onChange={handleInputChange}
              isDisabled={!isEmailVerified}
            />
            <button type="submit" className="submit-button">
              Register
            </button>
          </form>
        )}

        <button
          className="already-member-button"
          onClick={() => navigate("/login")}
        >
          Already have an account? Login
        </button>
      </div>

      {isOtpPopupVisible && (
        <OtpInput
          setToastData={setToastData}
          email={email}
          setIsOtpPopupVisible={setIsOtpPopupVisible}
          //   nextRoute="/login"
        />
      )}
      <Restriction flag={isOtpPopupVisible} />
      <Toast
        type={toastData.type}
        message={toastData.message}
        trigger={toastData.trigger}
      />
    </div>
  );
};

export default Register;
