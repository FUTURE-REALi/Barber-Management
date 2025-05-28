import React from 'react'

const CancelledBookings = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Cancelled Bookings</h2>
      <div className="text-gray-700">
        <p>This is where your cancelled bookings will be displayed.</p>
        {/* Example cancelled booking */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Barber Shop XYZ</div>
          <div className="text-sm text-gray-500">Cancelled on: 2023-10-01</div>
          <div className="mt-2">Reason: Personal reasons</div>
        </div>
      </div>
    </div>
  )
}

export default CancelledBookings