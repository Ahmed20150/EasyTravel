import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Import the required icon
import "../css/popup.css"; // Import the CSS file

const Popup = ({ show, message, onClose }) => {
  console.log("Popup component rendered");
  console.log("Popup show prop:", show);

  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <FaCheckCircle className="success-icon" /> {/* Success icon */}
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;
