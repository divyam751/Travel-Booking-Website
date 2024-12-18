import React from "react";
import "./VisaCard.css";

const VisaCard = () => {
  return (
    <div className="creditcard-container">
      <div className="creditcard">
        {/* Card Front */}
        <div className="creditcard-front">
          <div className="creditcard-brand">VISA</div>
          <div className="creditcard-number">4242 4242 4242 4242</div>
          <div className="creditcard-name">VOYAWANDER</div>
          <div className="creditcard-valid">
            <span>VALID THRU</span>
            <span>12/24</span>
          </div>
        </div>

        {/* Card Back */}
        <div className="creditcard-back">
          <div className="creditcard-bar"></div>
          <div className="creditcard-cvc">CVC: 123</div>
          <div className="creditcard-zip">ZIP: 12345</div>
        </div>
      </div>
    </div>
  );
};

export default VisaCard;
