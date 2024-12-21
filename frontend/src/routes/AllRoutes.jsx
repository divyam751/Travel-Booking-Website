import React, { useContext } from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/home/Home";
import Destinations from "../pages/destinations/Destinations";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import Hotels from "../pages/hotels/Hotels";
import Flights from "../pages/flights/Flights";
import Booking from "../pages/booking/Booking";
import Details from "../pages/details/Details";
import Checkout from "../pages/checkout/Checkout";
import Success from "../pages/success/Success";
import NotFound from "../pages/404/NotFound";
import { UserContext } from "../context/UserContext";
import { BookingContext } from "../context/BookingContext";

const AllRoutes = () => {
  const { user } = useContext(UserContext);
  const { booking } = useContext(BookingContext);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinations" element={<Destinations />} />
      {user.location && <Route path="/hotels" element={<Hotels />} />}
      {user.location && <Route path="/flights" element={<Flights />} />}
      {user.token && <Route path="/booking" element={<Booking />} />}
      {booking.place && <Route path="/confirm-booking" element={<Details />} />}
      {user.transactionId && <Route path="/checkout" element={<Checkout />} />}
      <Route path="/success" element={<Success />} />
      {user.location && <Route path="/register" element={<Register />} />}
      {user.location && <Route path="/login" element={<Login />} />}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AllRoutes;
