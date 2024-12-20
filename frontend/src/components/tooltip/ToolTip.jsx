// ToolTip.jsx
import React, { useState } from "react";
import "./ToolTip.css";

const ToolTip = ({ message, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      className="tooltip-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {showTooltip && (
        <div className="tooltip">
          <span>{message}</span>
        </div>
      )}
    </div>
  );
};

export default ToolTip;
