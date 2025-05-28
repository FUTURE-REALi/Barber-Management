import React from 'react'

const FavouriteSalon = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Favourite Salons</h2>
      <div className="text-gray-700">
        <p>This is where your favourite salons will be displayed.</p>
        {/* Example favourite salon */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Barber Shop XYZ</div>
          <div className="text-sm text-gray-500">123 Main St, City</div>
          <div className="mt-2">Great service and friendly staff!</div>
        </div>
      </div>
    </div>
  )
}

export default FavouriteSalon