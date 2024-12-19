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
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");
  const [isOtpPopupVisible, setIsOtpPopupVisible] = useState(false);
  const [email, setEmail] = useState("");

  const [toastData, setToastData] = useState({
    type: null,
    message: "",
    trigger: 0,
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { fullname, email, password } = formData;
    if (!fullname || !email || !password) {
      return "All fields are required!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address!";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long!";
    }
    return null;
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
      const response = await axios.post(`${API_URL}/users/register`, formData);

      if (response.data.status === "success") {
        setEmail(formData.email); // Save email for OTP verification
        setIsOtpPopupVisible(true);
        setFormData({ fullname: "", email: "", password: "" }); // Reset form
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
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <div className="register-container">
      <div className="register-formParent">
        <img src={logo} alt="logo" className="register-companyLogo" />
        <span className="register-companySlogan">
          Your ultimate travel companion!{" "}
        </span>
        <form className="register-form" onSubmit={handleRegister}>
          <InputBox
            type={"text"}
            name={"fullname"}
            label={"Full Name"}
            value={formData.fullname}
            width={"400px"}
            onChange={handleInputChange}
          />
          <InputBox
            type={"email"}
            name={"email"}
            label={"Email"}
            value={formData.email}
            width={"400px"}
            onChange={handleInputChange}
          />
          <InputBox
            type={"password"}
            name={"password"}
            label={"Password"}
            value={formData.password}
            width={"400px"}
            onChange={handleInputChange}
          />

          <button type="submit" className="submit-button">
            Register
          </button>
          <button
            className="already-member-button"
            onClick={() => navigate("/login")}
          >
            Already have an account? Login
          </button>
        </form>
      </div>
      {isOtpPopupVisible && (
        <OtpInput
          setToastData={setToastData}
          email={email}
          setIsOtpPopupVisible={setIsOtpPopupVisible}
          nextRoute={"/login"}
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
