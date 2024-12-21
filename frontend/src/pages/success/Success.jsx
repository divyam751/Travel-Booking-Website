import React, { useEffect } from "react";
import "./Success.css";
import { useResetAll } from "../../utils/ResetAll";

const Success = () => {
  const resetAll = useResetAll();

  useEffect(() => {
    setTimeout(() => {
      resetAll();
    }, 2000);
  }, []);
  return (
    <div className="success-container">
      <div className="success-card">
        <div className="success-icon">✅</div>
        <h1 className="success-title">Congratulations!</h1>
        <p className="success-message">
          Your trip has been successfully booked with us.
        </p>
        <p className="success-email-info">
          A confirmation email has been sent to your registered email with your
          booked ticket details.
        </p>
        <div className="success-footer">
          <p>Thank you for choosing us. We wish you a happy journey!</p>
        </div>
      </div>
    </div>
  );
};

export default Success;
