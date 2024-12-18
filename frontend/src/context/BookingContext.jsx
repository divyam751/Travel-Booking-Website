import React, { createContext, useState, useEffect } from "react";

// Create Booking Context
export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState(() => {
    // Load booking data from sessionStorage on initial render
    const savedBooking = sessionStorage.getItem("booking");
    return savedBooking ? JSON.parse(savedBooking) : {};
  });

  // Save booking to sessionStorage whenever it changes
  useEffect(() => {
    console.log("Booking called");
    if (booking && Object.keys(booking).length > 0) {
      sessionStorage.setItem("booking", JSON.stringify(booking));
    }
  }, [booking]);

  // Function to update booking
  const updateBooking = (newBooking) => {
    setBooking((prev) => ({ ...prev, ...newBooking }));
  };

  // Function to update booking

  return (
    <BookingContext.Provider value={{ booking, updateBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
