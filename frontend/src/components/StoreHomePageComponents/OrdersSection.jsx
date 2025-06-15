import React, { useEffect, useState } from "react";
import axios from "axios";

const tabs = [
  { label: "Preparing", value: "confirmed" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const OrdersSection = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState({});
  const [activeTab, setActiveTab] = useState("confirmed");
  const [search, setSearch] = useState("");

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

  const handleAction = async (bookingId, action) => {
    setActionLoading((prev) => ({ ...prev, [bookingId]: true }));
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/stores/updatebookingstatus/${bookingId}`,
        { status: action },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: action } : b
        )
      );
    } catch (err) {
      alert("Failed to update booking status.");
    }
    setActionLoading((prev) => ({ ...prev, [bookingId]: false }));
  };

  // Helper to get all service names from a booking
  const getServiceNames = (booking) => {
    if (Array.isArray(booking.service)) {
      // Nested population: service is array of StoreService, each with .service populated
      return booking.service
        .map(
          (ss) =>
            ss?.service?.name ||
            ss?.name || // fallback if not populated
            "Service"
        )
        .join(", ");
    }
    // Single service fallback
    return booking.service?.service?.name || booking.service?.name || "Service";
  };

  // Helper to render all services with quantity (if available)
  const renderServiceList = (booking) => {
    if (Array.isArray(booking.service)) {
      return booking.service.map((ss, idx) => (
        <div
          key={ss?._id || idx}
          className="flex items-center gap-2 text-base text-blue-700"
        >
          <span>
            {ss?.qty ? `${ss.qty} x ` : "1 x "}
            {ss?.service?.name || ss?.name || "Service"}
          </span>
        </div>
      ));
    }
    return (
      <div className="flex items-center gap-2 text-base text-blue-700">
        <span>
          1 x {booking.service?.service?.name || booking.service?.name || "Service"}
        </span>
      </div>
    );
  };

  // Filter bookings by tab and search
  const filteredBookings = bookings
    .filter((b) => b.status === activeTab)
    .filter(
      (b) =>
        b._id.toLowerCase().includes(search.toLowerCase()) ||
        (b.user?.fullname || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        getServiceNames(b).toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex-1 p-0 flex flex-col">
      {/* Navbar */}
      <div className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
        <div className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              className={`px-4 py-2 rounded-t-lg border-b-2 font-semibold transition ${
                activeTab === tab.value
                  ? "border-blue-600 text-blue-700 bg-white"
                  : "border-transparent text-gray-500 bg-gray-100 hover:text-blue-600"
              }`}
              onClick={() => setActiveTab(tab.value)}
            >
              {tab.label}
              <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                {bookings.filter((b) => b.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search orders, customer or service"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border rounded text-sm bg-gray-50 focus:outline-none"
            style={{ minWidth: 220 }}
          />
        </div>
      </div>
      {/* Orders List */}
      <div className="flex flex-col gap-6 p-8">
        {loading && <div>Loading bookings...</div>}
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {!loading && !error && filteredBookings.length === 0 && (
          <div>No bookings found for this store.</div>
        )}
        {!loading &&
          filteredBookings.length > 0 &&
          filteredBookings.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-xl shadow border p-6 flex flex-col md:flex-row gap-6"
            >
              {/* Left: Order Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">
                    {getServiceNames(b)}
                  </span>
                  <span className="text-gray-500 text-xs">
                    {b.user?.fullname || "Customer"}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  Booking ID: {b._id}
                </div>
                <div className="text-xs text-gray-500 mb-1">
                  {b.user?.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>Date</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  <span>{new Date(b.date).toLocaleString()}</span>
                </div>
              </div>
              {/* Middle: Service & Payment */}
              <div className="flex-1 min-w-[250px]">
                <div className="mb-2">{renderServiceList(b)}</div>
                <span className="ml-auto font-semibold block">
                  ₹{b.totalPrice}
                </span>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span>Total bill</span>
                  <span className="font-bold px-2 py-1 rounded bg-green-100 text-green-700">
                    ₹{b.totalPrice}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Payment ID: {b.paymentId}
                </div>
                {b.status === "confirmed" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                      disabled={actionLoading[b._id]}
                      onClick={() => handleAction(b._id, "completed")}
                    >
                      {actionLoading[b._id] === "completed"
                        ? "Finishing..."
                        : "Finish"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                      disabled={actionLoading[b._id]}
                      onClick={() => handleAction(b._id, "cancelled")}
                    >
                      {actionLoading[b._id] === "cancelled"
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </div>
                )}
                {b.status === "completed" && (
                  <span className="bg-green-100 text-green-700 px-4 py-2 rounded font-semibold mt-3 inline-block">
                    Finished
                  </span>
                )}
                {b.status === "cancelled" && (
                  <span className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold mt-3 inline-block">
                    Cancelled
                  </span>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersSection;