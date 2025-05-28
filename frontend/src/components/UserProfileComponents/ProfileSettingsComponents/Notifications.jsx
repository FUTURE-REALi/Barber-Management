import React from 'react'

const Notifications = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
      <div className="text-gray-700">
        <p>This is where your notifications will be displayed.</p>
        {/* Example notification */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">New Message</div>
          <div className="text-sm text-gray-500">You have a new message from John Doe.</div>
          <div className="mt-2">Click here to view the message.</div>
        </div>
      </div>
    </div>
  )
}

export default Notifications