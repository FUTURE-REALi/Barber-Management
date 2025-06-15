import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const HandleRazorpayPayment = ({ cart, userData }) => {
  const navigate = useNavigate();
  const handlePayment = async () => {
    const amount = cart.reduce((sum, item) => sum + item.price * item.qty, 0) + 10.63; // add tax or other charges as needed

    const { data: order } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/payment/create-order`,
      { amount, currency: "INR", receipt: `order_rcptid_${Date.now()}` }
    );

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "PocketSalon",
      description: "Order Payment",
      order_id: order.id,
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        verifyPaymentOnBackend(response);
      },
      prefill: {
        email: userData?.email,
        contact: userData?.phone,
      },
      method: {
        upi: true,
        card: true,
        netbanking: true,
        wallet: false,
      },
      theme: {
        color: "#3399cc",
      },
    };
    const verifyPaymentOnBackend = async(response) => {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/payment/verify-payment`,
        {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }
      )
        .then((res) => {
          console.log("Payment verified successfully:", res.data);
          console.log("Creating booking with user data:", userData);
          console.log("Cart items:", cart);
          console.log("storeId:", cart[0].store);
          axios.post(
            `${import.meta.env.VITE_BASE_URL}/bookings/add`,
            {
              user: userData._id,
              store: cart[0].store, // Assuming all items in cart are from the same store
              service: cart.map(item => item._id),
              totalPrice: order.amount / 100, // Convert to rupees
              paymentId: response.razorpay_payment_id,
              status: "confirmed",
              date: new Date()
            },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            }
          )
          .then((bookingRes) => {
            console.log("Booking created successfully:", bookingRes.data);
            alert("Booking confirmed! Your payment was successful.");
            navigate("/bookings");
          })
          .catch((bookingErr) => {
            console.error("Booking creation failed:", bookingErr);
            alert("Booking failed. Please try again.");
          });
        })
        .catch((err) => {
          console.error("Payment verification failed:", err);
          alert("Payment verification failed. Please try again.");
        });
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <button
      className="w-full bg-blue-600 text-white py-2 rounded font-semibold mb-2 hover:bg-blue-700"
      onClick={handlePayment}
      disabled={cart.length === 0}
    >
      Pay with UPI / Razorpay
    </button>
  );
};

export default HandleRazorpayPayment;