import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputBox.css";

const InputBox = ({
  name,
  type,
  label,
  value,
  onChange,
  width,
  maxLength = 30,
}) => {
  const [inputLabel, setInputLabel] = useState("inputBox-Empty");
  const [state, setState] = useState("password");
  const [responsiveWidth, setResponsiveWidth] = useState(width);

  const handleFocus = () => {
    setInputLabel("inputBox-focus");
  };

  const handleBlur = (event) => {
    if (event.target.value.trim() === "") {
      setInputLabel("inputBox-Empty");
    } else {
      setInputLabel("inputBox-focus inputBox-NotEmpty");
    }
  };

  const handleToggle = () => {
    setState((prev) => (prev === "password" ? "text" : "password"));
  };

  const updateWidth = () => {
    if (window.innerWidth < parseInt(width)) {
      setResponsiveWidth("100%");
    } else {
      setResponsiveWidth(width);
    }
  };

  useEffect(() => {
    // Initial width check
    updateWidth();

    // Add event listener to handle resize
    window.addEventListener("resize", updateWidth);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", updateWidth);
  }, [width]);

  const inputType =
    label === "Password" || label === "New Password" ? state : type;

  return (
    <div className="inputBox-container" style={{ width: responsiveWidth }}>
      <input
        name={name}
        type={inputType}
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        required
        style={{
          width: "100%", // Input takes full container width
        }}
      />
      <span className={inputLabel}>{label}</span>
      <div className="inputBox-showBtn" onClick={handleToggle}>
        {(label === "Password" || label === "New Password") &&
          (state === "password" ? <FaEye /> : <FaEyeSlash />)}
      </div>
    </div>
  );
};

export default InputBox;
