import React, { useState } from "react";
import axios from "axios";
import "./Contact.css";

import { useLoading } from "../../../../context/LoadingContext";
import { MdEmail } from "react-icons/md";
import { SiGooglemessages } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import { API_URL } from "../../../../constant";
import { useToast } from "../../../../context/ToastContext";

const Contact = () => {
  const { startLoading, stopLoading } = useLoading();
  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
    message: "",
  });

  const { showToast } = useToast();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { email, mobile, message } = formData;
    if (!email || !mobile || !message) {
      return "All fields are required!";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address!";
    }
    if (!/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits!";
    }
    if (message.trim().length < 10 && message.trim().length > 500) {
      return "Message must be at least 10 characters long!";
    }
    return null;
  };

  const handleSend = async (e) => {
    e.preventDefault();
    startLoading();
    const validationError = validateForm();
    if (validationError) {
      showToast({ type: "error", message: validationError });

      stopLoading();
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/messages/`, formData);

      if (response.status === 200 || response.data.status === "success") {
        showToast({ type: "success", message: "Message sent successfully!" });

        setFormData({ email: "", mobile: "", message: "" });
      } else {
        showToast({
          type: "error",
          message: response.data.message || "Failed to send the message",
        });
      }
    } catch (error) {
      showToast({
        type: "error",
        message: error.response?.data?.message || "An error occurred",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <section className="contact-container">
      <div className="contact-banner"></div>
      <div className="contact-container-header">
        <span>Get in touch</span>
        <span>
          Don't wait, reach out to us now and let us help you plan your next
          vacation. Our dedicated team is always here to answer your questions
          and make your travel dreams a reality.
        </span>
      </div>
      <form className="contact-form" onSubmit={handleSend}>
        <div className="contact-form__flex">
          <div className="contact-form__inputFlex">
            <MdEmail />

            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="contact-form__input"
            />
          </div>
          <div className="contact-form__inputFlex">
            <FaPhoneAlt />

            <input
              type="number"
              id="mobile"
              name="mobile"
              placeholder="Mobile number"
              value={formData.mobile}
              onChange={handleInputChange}
              required
              className="contact-form__input"
              onInput={(e) => {
                // Restricting to 10 digits
                if (e.target.value.length > 10) {
                  e.target.value = e.target.value.slice(0, 10);
                }
              }}
            />
          </div>
        </div>
        <div className="contact-form__inputFlex">
          <SiGooglemessages />
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            value={formData.message}
            onChange={handleInputChange}
            required
            className="contact-form__input"
          ></textarea>{" "}
        </div>
        <button type="submit" className="contact-sendBtn">
          Send
        </button>
      </form>
    </section>
  );
};

export default Contact;
