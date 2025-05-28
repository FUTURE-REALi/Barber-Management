import React from 'react'

const CommentsSection = () => {
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Comments</h2>
      <div className="text-gray-700">
        <p>This is where user comments will be displayed.</p>
        {/* Example comment */}
        <div className="mt-4 p-4 border rounded bg-gray-50">
          <div className="font-bold">John Doe</div>
          <div className="text-sm text-gray-500">2 hours ago</div>
          <div className="mt-2">Great service! Highly recommend this place.</div>
        </div>
      </div>
    </div>
  )
}

export default CommentsSection