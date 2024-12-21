import React, { useContext, useEffect, useState } from "react";

import "./Booking.css";
import InputBox from "../../components/inputbox/InputBox";
import { BookingContext } from "../../context/BookingContext";
import { useNavigate } from "react-router";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";
import { useToast } from "../../context/ToastContext";

const Booking = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    gender: "",
    address: "",
    adharNumber: "",
    numOfTickets: 1,
  });

  const { booking, updateBooking } = useContext(BookingContext);
  const { updateUser } = useContext(UserContext);

  const { showToast } = useToast();
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
    const { fullName, age, gender, address, adharNumber, numOfTickets } =
      formData;

    // Check for missing fields
    if (!fullName || !age || !gender || !address || !adharNumber) {
      showToast({ type: "error", message: "Please fill out all fields." });
      return;
    }

    // Validate Age (must be a number between 18 and 100)
    const ageNumber = Number(age);
    if (isNaN(ageNumber) || ageNumber < 18 || ageNumber > 100) {
      showToast({ type: "error", message: "Age must be between 18 and 100." });
      return;
    }

    // Validate Aadhar number (must be exactly 12 digits and numeric)
    const adharRegex = /^[0-9]{12}$/;
    if (!adharRegex.test(adharNumber)) {
      showToast({
        type: "error",
        message: "Aadhar number must be exactly 12 digits and numeric.",
      });
      return;
    }

    // Validate Address (check if the address is not empty and has reasonable length)
    if (address.length < 5) {
      showToast({
        type: "error",
        message: "Address must be at least 5 characters long.",
      });
      return;
    }

    // Success Case
    showToast({ type: "success", message: "Form submitted successfully!" });

    // Perform further actions after successful validation
    updateBooking({ ...formData });

    // Clear form data after submission
    setFormData({
      fullName: "",
      age: "",
      gender: "",
      address: "",
      adharNumber: "",
      numOfTickets: 1,
    });

    // Get amount and navigate to the next page
    await getAmount({ ...booking, ...formData });
    navigate("/confirm-booking");
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
        updateUser({
          transactionId: data.data.transactionId,
          totalAmount: data.data.totalAmount,
        });
        return;
      } else {
        // Handle API "error" response or unexpected success structure
        console.error(
          "API Error:",
          data.message || "Unexpected error occurred"
        );
        throw new Error(data.message || "Unexpected error occurred");
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
            type="number"
            name="adharNumber"
            label="Aadhar Number"
            value={formData.adharNumber}
            onChange={handleChange}
            width="100%"
            maxDigits={12}
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
      </div>
    </div>
  );
};

export default Booking;
