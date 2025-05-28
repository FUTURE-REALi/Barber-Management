import React from 'react'

const PaymentMethods = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
      <div className="text-gray-700">
        <p>This is where your payment methods will be displayed.</p>
        {/* Example payment method */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">Visa **** 1234</div>
          <div className="text-sm text-gray-500">Expires 12/24</div>
          <div className="mt-2">Default payment method</div>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethods