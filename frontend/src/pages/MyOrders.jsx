import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserDataContext } from "../context/UserContext";
import { useSearchParams } from "react-router-dom";
import AllBookings from "../components/ManageBookingComponents/AllBookings";
import UpcomingBookings from "../components/ManageBookingComponents/UpcomingBookings";
import OngoingBookings from "../components/ManageBookingComponents/OngoingBookings";
import PreviousBookings from "../components/ManageBookingComponents/PreviousBookings";
import CancelledBookings from "../components/ManageBookingComponents/CancelledBookings";

const getStatus = (booking) => {
  const now = new Date();
  const bookingDate = new Date(booking.date);
  if (booking.status === "cancelled") return "Cancelled";
  if (booking.status === "completed") return "Completed";
  if (bookingDate > now) return "Upcoming";
  if (
    bookingDate.toDateString() === now.toDateString() &&
    booking.status === "confirmed"
  )
    return "Ongoing";
  if (bookingDate < now) return "Previous";
  return booking.status;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "upcoming", label: "Upcoming" },
  { key: "ongoing", label: "Ongoing" },
  { key: "previous", label: "Previous" },
  { key: "cancelled", label: "Cancelled" },
];

const MyOrders = () => {
  const { userData } = useContext(UserDataContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";

  useEffect(() => {
    if (!userData?._id) return;
    setLoading(true);
    axios
      .get(
        `${import.meta.env.VITE_BASE_URL}/bookings/user/${userData._id}`,
        { withCredentials: true }
      )
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(() => {
        setBookings([]);
        setLoading(false);
      });
  }, [userData]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/bookings/${bookingId}`,
        { status: "cancelled" },
        { withCredentials: true }
      );
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      alert("Failed to cancel booking.");
    }
  };

  const filterBookings = (type) => {
    return bookings.filter((b) => {
      const status = getStatus(b);
      if (type === "all") return true;
      if (type === "upcoming") return status === "Upcoming";
      if (type === "ongoing") return status === "Ongoing";
      if (type === "previous") return status === "Previous" || status === "Completed";
      if (type === "cancelled") return status === "Cancelled";
      return true;
    });
  };

  const renderBookingsComponent = () => {
    const props = {
      bookings: filterBookings(filter),
      loading,
      onCancel: handleCancel,
    };
    switch (filter) {
      case "upcoming":
        return <UpcomingBookings {...props} />;
      case "ongoing":
        return <OngoingBookings {...props} />;
      case "previous":
        return <PreviousBookings {...props} />;
      case "cancelled":
        return <CancelledBookings {...props} />;
      default:
        return <AllBookings {...props} />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-2">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`px-3 py-1 rounded ${filter === f.key ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setSearchParams({ filter: f.key })}
          >
            {f.label}
          </button>
        ))}
      </div>
      {renderBookingsComponent()}
    </div>
  );
};

export default MyOrders;