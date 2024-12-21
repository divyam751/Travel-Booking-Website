import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Login.css";
import InputBox from "../../components/inputbox/InputBox";
import logo from "../../assets/images/logo.webp";
import Restriction from "../../utils/Restriction";
import { useLoading } from "../../context/LoadingContext";
import { useNavigate } from "react-router";
import { IoCloseCircleSharp } from "react-icons/io5";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const Login = () => {
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [forgetPasswordPopup, setForgetPasswordPopup] = useState(false);
  const [forgetEmail, setForgetEmail] = useState("");
  const [otpData, setOtpData] = useState({
    otp: "",
    newPassword: "",
  });
  const [isOtpStep, setIsOtpStep] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();

  const { updateUser } = useContext(UserContext);
  const { showToast } = useToast();

  const validateLoginForm = () => {
    const { email, password } = formData;
    if (!email || !password) {
      return "All fields are required!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address!";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    startLoading();
    const validationError = validateLoginForm();
    if (validationError) {
      showToast({ type: "error", message: validationError });

      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, formData);

      if (response.data.status === "success") {
        showToast({ type: "success", message: "Login successful!" });

        updateUser({ token: response.data.data.token });

        setFormData({ email: "", password: "" }); // Reset form
        navigate("/booking");
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Login failed",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message || "An error occurred during login",
      });
    } finally {
      stopLoading();
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    startLoading();
    if (!forgetEmail) {
      showToast({ type: "error", message: "Email is required!" });

      stopLoading();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgetEmail)) {
      showToast({
        type: "error",
        message: "Please enter a valid email address!",
      });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/forget-password`, {
        email: forgetEmail,
      });

      if (response.data.status === "success") {
        showToast({ type: "success", message: "OTP sent successfully!" });

        setIsOtpStep(true);
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during the request",
      });
    } finally {
      stopLoading();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const { otp, newPassword } = otpData;
    if (!otp || !newPassword) {
      showToast({ type: "error", message: "All fields are required!" });

      return;
    }
    if (newPassword.length < 6) {
      showToast({
        type: "error",
        message: "Password must be at least 6 characters long!",
      });

      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/forget-password`, {
        email: forgetEmail,
        otp,
        newPassword,
      });

      if (response.data.status === "success") {
        showToast({ type: "success", message: "Password reset successful!" });

        setForgetPasswordPopup(false);
        setOtpData({ otp: "", newPassword: "" });
        setForgetEmail("");
        setIsOtpStep(false);
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Failed to reset password",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during the request",
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top
  }, []);

  return (
    <div className="login-container">
      <div className="login-formParent">
        <img src={logo} alt="logo" className="login-companyLogo" />
        <p className="login-companySlogan">Welcome back! Login to continue.</p>
        <form className="login-form" onSubmit={handleLogin}>
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
          <span
            className="forget-password-button"
            onClick={() => setForgetPasswordPopup(true)}
          >
            Forgot Password?
          </span>

          <button type="submit" className="submit-button">
            Login
          </button>
        </form>

        <button
          className="new-member-button"
          onClick={() => navigate("/register")}
        >
          Don't have an account? Register
        </button>
      </div>
      {forgetPasswordPopup && (
        <div className="popup-overlay">
          <div className="popup-container">
            <span className="close-popup-buttonBox">
              <IoCloseCircleSharp
                className="close-popup-button"
                size={30}
                onClick={() => {
                  setForgetPasswordPopup(false);
                  setIsOtpStep(false);
                  setOtpData({ otp: "", newPassword: "" });
                  setForgetEmail("");
                }}
              />
            </span>

            <h2>{isOtpStep ? "Reset Password" : "Forgot Password"}</h2>
            {!isOtpStep ? (
              <form onSubmit={handleForgetPassword}>
                <InputBox
                  type={"email"}
                  label={"Email"}
                  value={forgetEmail}
                  width={"400px"}
                  onChange={(e) => setForgetEmail(e.target.value)}
                />
                <button type="submit" className="login-submit-button">
                  Send OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleOtpSubmit} className="reset-password-form">
                <InputBox
                  type={"text"}
                  label={"OTP"}
                  value={otpData.otp}
                  width={"400px"}
                  onChange={(e) =>
                    setOtpData({ ...otpData, otp: e.target.value })
                  }
                  maxLength="6"
                />
                <InputBox
                  type={"password"}
                  label={"New Password"}
                  value={otpData.newPassword}
                  width={"400px"}
                  onChange={(e) =>
                    setOtpData({ ...otpData, newPassword: e.target.value })
                  }
                />
                <button type="submit" className="reset-submit-button">
                  Reset Password
                </button>
              </form>
            )}
          </div>
        </div>
      )}
      <Restriction flag={forgetPasswordPopup || isOtpStep} />
    </div>
  );
};

export default Login;
