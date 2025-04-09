// src/Components/Logout.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("login");
    navigate("/", { replace: true });
  }, [navigate]);

  return <div>Logging out...</div>;
}
