import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./Login.css";
import InputBox from "../../components/inputbox/InputBox";
import Toast from "../../utils/Toast";
import logo from "../../assets/images/logo.webp";
import Restriction from "../../utils/Restriction";
import { useLoading } from "../../context/LoadingContext";
import { useNavigate } from "react-router";
import { IoCloseCircleSharp } from "react-icons/io5";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";

const Login = () => {
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [toastData, setToastData] = useState({
    type: null,
    message: "",
    trigger: 0,
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
      setToastData({
        type: "error",
        message: validationError,
        trigger: Date.now(),
      });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/login`, formData);

      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: "Login successful!",
          trigger: Date.now(),
        });

        updateUser({ token: response.data.data.token });

        setFormData({ email: "", password: "" }); // Reset form

        setTimeout(() => {
          navigate("/booking");
        }, 2000);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Login failed",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      setToastData({
        type: "error",
        message:
          error.response?.data?.message || "An error occurred during login",
        trigger: Date.now(),
      });
    } finally {
      stopLoading();
    }
  };

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    startLoading();
    if (!forgetEmail) {
      setToastData({
        type: "error",
        message: "Email is required!",
        trigger: Date.now(),
      });
      stopLoading();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgetEmail)) {
      setToastData({
        type: "error",
        message: "Please enter a valid email address!",
        trigger: Date.now(),
      });
      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/users/forget-password`, {
        email: forgetEmail,
      });

      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: "OTP sent successfully!",
          trigger: Date.now(),
        });
        setIsOtpStep(true);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Failed to send OTP",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during the request",
        trigger: Date.now(),
      });
    } finally {
      stopLoading();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const { otp, newPassword } = otpData;
    if (!otp || !newPassword) {
      setToastData({
        type: "error",
        message: "All fields are required!",
        trigger: Date.now(),
      });
      return;
    }
    if (newPassword.length < 6) {
      setToastData({
        type: "error",
        message: "Password must be at least 6 characters long!",
        trigger: Date.now(),
      });
      return;
    }
    // ======================
    console.log({ forgetEmail });
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/users/forget-password",
        {
          email: forgetEmail,
          otp,
          newPassword,
        }
      );

      if (response.data.status === "success") {
        setToastData({
          type: "success",
          message: "Password reset successful!",
          trigger: Date.now(),
        });
        setForgetPasswordPopup(false);
        setOtpData({ otp: "", newPassword: "" });
        setForgetEmail("");
        setIsOtpStep(false);
      } else {
        setToastData({
          type: "error",
          message: response.data.message || "Failed to reset password",
          trigger: Date.now(),
        });
      }
    } catch (error) {
      setToastData({
        type: "error",
        message:
          error.response?.data?.message ||
          "An error occurred during the request",
        trigger: Date.now(),
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
      <Toast
        type={toastData.type}
        message={toastData.message}
        trigger={toastData.trigger}
      />
    </div>
  );
};

export default Login;
