import React from "react";
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

const AllRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/destinations" element={<Destinations />} />
      <Route path="/hotels" element={<Hotels />} />
      <Route path="/flights" element={<Flights />} />
      <Route path="/booking" element={<Booking />} />
      <Route path="/confirm-booking" element={<Details />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/success" element={<Success />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
};

export default AllRoutes;
