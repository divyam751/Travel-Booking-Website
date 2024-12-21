import React, { createContext, useState, useEffect, useContext } from "react";

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
    if (booking && Object.keys(booking).length > 0) {
      sessionStorage.setItem("booking", JSON.stringify(booking));
    }
  }, [booking]);

  // Function to update booking
  const updateBooking = (newBooking) => {
    setBooking((prev) => ({ ...prev, ...newBooking }));
  };

  // Function to reset booking
  const resetBooking = () => setBooking(null);

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);
