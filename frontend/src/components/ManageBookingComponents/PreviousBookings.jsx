import React from "react";

const PreviousBookings = ({ bookings, loading }) => {
  if (loading) return <div className="text-center text-gray-500">Loading...</div>;
  if (!bookings.length) return <div className="text-center text-gray-500">No previous bookings.</div>;
  return (
    <div className="space-y-4">
      {bookings.map((b) => (
        <div key={b._id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between bg-white shadow">
          <div>
            <div className="font-semibold text-lg">{b.service?.name || b.serviceName || "Service"}</div>
            <div className="text-gray-500 text-sm">{b.store?.name && <span>at {b.store.name}</span>}</div>
            <div className="text-gray-500 text-sm">Date: {new Date(b.date).toLocaleString()}</div>
            <div className="text-gray-500 text-sm">Status: <span className="text-gray-700">Previous</span></div>
            <div className="text-gray-500 text-sm">Total: ₹{b.totalPrice}</div>
            <div className="text-gray-500 text-sm">Payment ID: {b.paymentId}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PreviousBookings;