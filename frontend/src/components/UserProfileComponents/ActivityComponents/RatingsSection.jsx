import React from 'react'

const RatingsSection = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Your Ratings</h2>
      <div className="text-gray-700">
        <p>This is where your ratings will be displayed.</p>
        {/* Example rating */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Barber Shop XYZ</div>
          <div className="text-sm text-gray-500">4.5 stars</div>
          <div className="mt-2">Great service and friendly staff!</div>
        </div>
      </div>
    </div>
  )
}

export default RatingsSection