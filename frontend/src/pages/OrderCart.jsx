import React from 'react'

const OrderCart = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Your Order Cart</h1>
        <p className="text-gray-600 text-center mb-6">Your cart is currently empty.</p>
        <div className="flex justify-center">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
            onClick={() => window.location.href = '/'}
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderCart