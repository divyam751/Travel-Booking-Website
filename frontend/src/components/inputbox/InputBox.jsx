import React, { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./InputBox.css";
import { RiVerifiedBadgeFill } from "react-icons/ri";

const InputBox = ({
  name,
  type,
  label,
  value,
  onChange,
  width,
  maxLength = 30,
  isDisabled = false,
}) => {
  const [inputLabel, setInputLabel] = useState("inputBox-Empty");
  const [state, setState] = useState("password");
  const [responsiveWidth, setResponsiveWidth] = useState(width);

  const handleFocus = () => {
    setInputLabel("inputBox-focus");
  };

  const handleBlur = (event) => {
    if (!isDisabled) {
      if (event.target.value.trim() === "") {
        setInputLabel("inputBox-Empty");
      } else {
        setInputLabel("inputBox-focus inputBox-NotEmpty");
      }
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

  useEffect(() => {
    // Set label to focus state when disabled
    if (isDisabled) {
      setInputLabel("inputBox-varified");
    }
  }, [isDisabled]);

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
        disabled={isDisabled}
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
      {label === "Email" && isDisabled && (
        <div className="inputBox-varifiedBtn">
          <span>VARIFIED</span>
          <span>
            <RiVerifiedBadgeFill />
          </span>
        </div>
      )}
    </div>
  );
};

export default InputBox;
