import React from 'react'

const Invoices = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Invoices</h2>
      <div className="text-gray-700">
        <p>This is where your invoices will be displayed.</p>
        {/* Example invoice */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Invoice #12345</div>
          <div className="text-sm text-gray-500">Date: 2023-10-01</div>
          <div className="mt-2">Total Amount: $100.00</div>
        </div>
      </div>
    </div>
  )
}

export default Invoices