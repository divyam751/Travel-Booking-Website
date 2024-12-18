import React, { useContext, useEffect, useState } from "react";

import "./Booking.css";
import InputBox from "../../components/inputbox/InputBox";
import Toast from "../../utils/Toast";
import { BookingContext } from "../../context/BookingContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";

const Booking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    address: "",
    adharNumber: "",
    numOfTickets: 1,
  });

  const [toastData, setToastData] = useState({
    type: "",
    message: "",
    trigger: false,
  });

  const { booking, updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDec = () => {
    setFormData((prev) => ({
      ...prev,
      numOfTickets: prev.numOfTickets > 1 ? prev.numOfTickets - 1 : 1,
    }));
  };

  const handleInc = () => {
    setFormData((prev) => ({
      ...prev,
      numOfTickets: prev.numOfTickets + 1,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Extract form data
    const { fullName, age, gender, address, adharNumber } = formData;

    // Form validation
    if (!fullName || !age || !gender || !address || !adharNumber) {
      setToastData({
        type: "error",
        message: "Please fill out all fields.",
        trigger: !toastData.trigger,
      });
      return;
    }

    // Age validation
    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 100) {
      setToastData({
        type: "error",
        message: "Age must be between 18 and 100.",
        trigger: !toastData.trigger,
      });
      return;
    }

    // Aadhar number validation
    const adharRegex = /^[0-9]{12}$/;
    if (!adharRegex.test(adharNumber)) {
      setToastData({
        type: "error",
        message: "Aadhar number must be exactly 12 digits and numeric.",
        trigger: !toastData.trigger,
      });
      return;
    }

    // Success Case
    setToastData({
      type: "success",
      message: "Form submitted successfully!",
      trigger: !toastData.trigger,
    });

    updateBooking({ ...formData });

    // console.log("Form Data: ", formData);
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      address: "",
      adharNumber: "",
      numOfTickets: 1,
    });

    const totalAmount = await getAmount({ ...booking, ...formData });
    // console.log({ totalAmount });

    setTimeout(() => {
      navigate("/confirm-booking");
    }, 3000);
  };

  const getAmount = async (payload) => {
    const apiUrl = `${API_URL}/booking/create`;

    try {
      // Send POST request with payload
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      // Parse response
      const data = await response.json();

      // Handle API response structure
      if (response.ok && data.status === "success") {
        // Success response
        // return {
        //   success: true,
        //   transactionId: data.data.transactionId,
        //   totalAmount: data.data.totalAmount,
        //   message: data.message,
        // };
        updateUser({
          transactionId: data.data.transactionId,
          totalAmount: data.data.totalAmount,
        });
        return data.data.totalAmount;
      } else {
        // Handle API "error" response or unexpected success structure
        console.error(
          "API Error:",
          data.message || "Unexpected error occurred"
        );
        // return {
        //   success: false,
        //   message: data.message || "An unexpected error occurred",
        //   errors: data.errors || [],
        // };
        return "error";
      }
    } catch (error) {
      // Handle network or unexpected errors
      console.error("Network Error:", error.message);
      return {
        success: false,
        message: "Failed to connect to the server.",
      };
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bookingPage">
      <div className="booking-container">
        <h2 className="booking-title">Booking Form</h2>
        <form className="booking-form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <InputBox
            type="text"
            name="fullName"
            label="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            width="100%"
          />

          {/* Age */}
          <InputBox
            type="number"
            name="age"
            label="Age"
            value={formData.age}
            onChange={handleChange}
            width="100%"
            maxLength={2}
          />

          {/* Select Gender */}
          <div className="booking-select-container">
            <label className="booking-label">Select Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="booking-select"
              required
            >
              <option value="">--Select--</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Address */}
          <div className="booking-textarea-container">
            <label className="booking-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="4"
              className="booking-textarea"
              placeholder="Enter your address"
              required
            ></textarea>
          </div>

          {/* Aadhar Number */}
          <InputBox
            type="text"
            name="adharNumber"
            label="Aadhar Number"
            value={formData.adharNumber}
            onChange={handleChange}
            width="100%"
            maxLength={12}
          />

          {/* Number of Tickets */}
          <div className="booking__TicketCounter">
            <h3>Number of Tickets</h3>
            <div className="ticketCounter">
              <button type={"button"} onClick={handleDec}>
                -
              </button>
              {formData.numOfTickets}
              <button type={"button"} onClick={handleInc}>
                +
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="booking-submit-btn">
            Submit
          </button>
        </form>

        {/* Toast Notification */}
        <Toast
          type={toastData.type}
          message={toastData.message}
          trigger={toastData.trigger}
        />
      </div>
    </div>
  );
};

export default Booking;
