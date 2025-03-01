import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import "./Register.css";
import InputBox from "../../components/inputbox/InputBox";
import logo from "../../assets/images/logo.webp";
import Restriction from "../../utils/Restriction";
import OtpInput from "../../components/inputbox/OtpInput";
import { useLoading } from "../../context/LoadingContext";
import { useNavigate } from "react-router";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const Register = () => {
  const { startLoading, stopLoading } = useLoading();
  const { user, deleteUser } = useContext(UserContext);
  const [email, setEmail] = useState(""); // Retrieve email from session storage if available
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    password: "",
  });

  const { showToast } = useToast();
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
      showToast({ type: "error", message: validationError });

      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/verify-email`, {
        email,
      });

      if (response.data.status === "success") {
        sessionStorage.setItem("email", email); // Save email in session storage
        setIsOtpPopupVisible(true);
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Email verification failed",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred while sending OTP",
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
      showToast({ type: "error", message: validationError });

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
        showToast({ type: "success", message: response.data.message });
        sessionStorage.removeItem("email");
        deleteUser();
        navigate("/login");
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Registration failed",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during registration",
      });
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("email")) {
      setEmail(sessionStorage.getItem("email"));
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
              isDisabled={isOtpPopupVisible || user.verified}
              flag={true}
            />
            {!user.verified && (
              <button type="submit" className="submit-button">
                Send OTP
              </button>
            )}
          </form>
        }
        <br />
        {user.verified && (
          <form className="register-form" onSubmit={handleRegister}>
            <InputBox
              type="text"
              name="fullname"
              label="Full Name"
              value={formData.fullname}
              width="400px"
              onChange={handleInputChange}
              isDisabled={!user.verified}
            />
            <InputBox
              type="password"
              name="password"
              label="Password"
              value={formData.password}
              width="400px"
              onChange={handleInputChange}
              isDisabled={!user.verified}
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
        <OtpInput email={email} setIsOtpPopupVisible={setIsOtpPopupVisible} />
      )}
      <Restriction flag={isOtpPopupVisible} />
    </div>
  );
};

export default Register;
