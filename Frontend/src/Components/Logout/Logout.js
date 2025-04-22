import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/Logout.css";

export default function Logout() {
  const navigate = useNavigate();

  const handleConfirm = () => {
    sessionStorage.removeItem("login");
    navigate("/", { replace: true }); 
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="logout-dialog-overlay">
      <div className="logout-dialog-box">
        <h3>Confirm Logout</h3>
        <p>Are you sure you want to sign out?</p>
        <div className="dialog-buttons">
          <button onClick={handleCancel} className="cancel-btn">
            Cancel
          </button>
          <button onClick={handleConfirm} className="confirm-btn">
            Yes, Logout
          </button>
        </div>
      </div>
    </div>
  );
}
