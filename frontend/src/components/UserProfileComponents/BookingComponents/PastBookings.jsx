import React from 'react'

const PastBookings = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Past Bookings</h2>
      <div className="text-gray-700">
        <p>This is where your past bookings will be displayed.</p>
        {/* Example booking */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Barber Shop XYZ</div>
          <div className="text-sm text-gray-500">Date: 2023-10-01</div>
          <div className="mt-2">Service: Haircut</div>
          <div className="mt-2">Status: Completed</div>
        </div>
      </div>
    </div>
  )
}

export default PastBookings