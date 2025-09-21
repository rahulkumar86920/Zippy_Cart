import React, { useEffect, useState } from "react";
import { useCart } from "./CartContext"; // adjust path if needed
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const VerifyPaymentPage = () => {
  const [statusMsg, setStatusMsg] = useState("Verifying payment...");
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(search);
    const session_id = params.get("session_id");
    const payment_status = params.get("payment_status");
    const token = localStorage.getItem("authToken");

    console.log("VerifyPaymentPage mounted");
    console.log("session_id:", session_id, "payment_status:", payment_status);

    if (payment_status === "cancel") {
      navigate("/checkout", { replace: true });
      return;
    }

    if (!session_id) {
      setStatusMsg("No session ID provided!");
      return;
    }

    // call backend confirm endpoint
    axios
      .get(`http://localhost:8080/api/orders/confirm`, {
        params: { session_id },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      .then(async (res) => {
        console.log("confirm response:", res.data);
        // wait for clearCart to finish (it calls backend /api/cart/clear internally)
        await clearCart();
        navigate("/myorders", { replace: true });
      })
      .catch((error) => {
        console.error("Error in confirmation", error);
        setStatusMsg("There was an error confirming your payment.");
      });
  }, [search, clearCart, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <p>{statusMsg}</p>
    </div>
  );
};

export default VerifyPaymentPage;
