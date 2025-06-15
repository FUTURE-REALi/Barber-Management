import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistorySection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/stores/getstorebookings`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings(res.data.bookings || []);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch bookings"
      );
    }
    setLoading(false);
  };

  // Consider past orders as completed or cancelled
  const pastBookings = bookings.filter(
    (b) => b.status === "completed" || b.status === "cancelled"
  );

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Order History</h2>
      {loading && <div>Loading past orders...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {!loading && !error && pastBookings.length === 0 && (
        <div>No past orders found for this store.</div>
      )}
      {!loading && pastBookings.length > 0 && (
        <div className="space-y-4">
          {pastBookings.map((b) => (
            <div
              key={b._id}
              className="border rounded-lg p-4 bg-white shadow flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                <div className="font-semibold text-lg mb-1">
                  {Array.isArray(b.service)
                    ? b.service.map((ss) => ss?.service?.name).join(", ")
                    : b.service?.service?.name || b.service?.name || "Service"}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  Customer: {b.user?.fullname || "Unknown"}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  Date: {new Date(b.date).toLocaleString()}
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  Status:{" "}
                  <span
                    className={
                      b.status === "cancelled"
                        ? "text-red-500"
                        : b.status === "completed"
                        ? "text-green-600"
                        : "text-blue-600"
                    }
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mb-1">
                  Total: ₹{b.totalPrice}
                </div>
                <div className="text-gray-500 text-sm">
                  Payment ID: {b.paymentId}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistorySection;