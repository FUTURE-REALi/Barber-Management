import React from 'react'

const UserProfile = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
        <p className="mb-4">Name: John Doe</p>
        <p className="mb-4">Email: </p>
      </div>
    </div>
  )
}
export default UserProfile