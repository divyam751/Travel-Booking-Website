import React, { useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

import "./Checkout.css";
import { useLoading } from "../../context/LoadingContext";
import { API_URL } from "../../constant";
import { UserContext } from "../../context/UserContext";
import VisaCard from "../../components/visacard/VisaCard";
import { useNavigate } from "react-router";
import { useToast } from "../../context/ToastContext";
import { useResetAll } from "../../utils/ResetAll";

// Load Stripe using environment variable
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [payableAmount, setPayableAmount] = useState(0);
  const { startLoading, stopLoading } = useLoading();

  const resetAll = useResetAll();

  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    startLoading(); // Show loading spinner

    showToast({
      type: "info",
      message: "Please wait while we securely process your payment.",
    });

    try {
      // Step 1: Request clientSecret from the backend
      const response = await axios.post(
        `${API_URL}/payments/create-payment-intent`,
        {
          amount: payableAmount, // Amount in cents
          currency: "usd",
        }
      );

      if (!response.data || !response.data.clientSecret) {
        throw new Error("Payment initialization failed.");
      }

      // Step 2: Confirm the payment with Stripe
      const result = await stripe.confirmCardPayment(
        response.data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      // Handle payment result
      if (result.error) {
        // Handle Stripe errors
        showToast({ type: "error", message: result.error.message });
      } else if (result.paymentIntent?.status === "succeeded") {
        // Save booking only on successful payment
        const bookingResult = await saveBooking(user.transactionId);
        if (bookingResult.success) {
          // resetAll();
          showToast({
            type: "success",
            message: "Payment successful!",
          });
          setTimeout(() => {
            showToast({
              type: "success",
              message:
                "Your booking is confirmed. We wish you a happy journey!",
            });
          }, 2000);

          navigate("/success");
        } else {
          showToast({ type: "error", message: bookingResult.message });
        }
      }
    } catch (err) {
      console.error("Error during payment:", err);
      showToast({
        type: "error",
        message: err.message || "Something went wrong. Please try again.",
      });
    } finally {
      stopLoading(); // Stop loading spinner
    }
  };

  // Context to get user data
  const { user } = useContext(UserContext);

  // Function to save booking after successful payment
  const saveBooking = async (transactionId) => {
    const apiUrl = `${API_URL}/booking/save-booking`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ transactionId, paid: true }),
      });

      const data = await response.json();

      // Check for success status
      if (response.ok && data.status === "success") {
        return { success: true, message: "Booking saved successfully." };
      } else {
        return {
          success: false,
          message: data.message || "Failed to save booking.",
        };
      }
    } catch (error) {
      console.error("Error saving booking:", error);
      return {
        success: false,
        message: "Network error. Failed to connect to the server.",
      };
    }
  };

  const getUpdatedTotalAmount = async () => {
    const apiUrl = `${API_URL}/booking/total-amount`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ transactionId: user.transactionId }),
      });

      // Parse response
      const data = await response.json();

      // Handle API response structure
      if (response.ok && data.status === "success") {
        setPayableAmount(data.data.totalAmount);
        return;
      } else {
        // Handle API "error" response or unexpected success structure
        console.error(
          "API Error:",
          data.message || "Unexpected error occurred"
        );

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
    getUpdatedTotalAmount();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="checkout-container">
      <form onSubmit={handleSubmit} className="checkout-form">
        <CardElement className="card-input" />
        <button type="submit" className="pay-button" disabled={!stripe}>
          {`Pay $ ${payableAmount}`}
        </button>
      </form>
    </div>
  );
};

const Checkout = () => {
  return (
    <Elements stripe={stripePromise}>
      <div className="checkout-wrapper">
        <h2 className="checkout-title">Payment Page</h2>
        <VisaCard />
        <h5>Please enter card details for payment</h5> <br></br>
        <CheckoutForm />
      </div>
    </Elements>
  );
};

export default Checkout;
