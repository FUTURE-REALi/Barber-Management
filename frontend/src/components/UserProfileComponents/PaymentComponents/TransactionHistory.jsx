import React from 'react'

const TransactionHistory = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
      <div className="text-gray-700">
        <p>This is where your transaction history will be displayed.</p>
        {/* Example transaction */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Transaction ID: 123456</div>
          <div className="text-sm text-gray-500">Date: 2023-10-01</div>
          <div className="mt-2">Amount: $50.00</div>
          <div className="mt-1">Status: Completed</div>
        </div>
      </div>
    </div>
  )
}

export default TransactionHistory