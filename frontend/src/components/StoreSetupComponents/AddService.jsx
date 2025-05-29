import React from 'react'

const AddService = () => {
  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Service</h2>
      <form className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="serviceName">Service Name</label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service name"
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="serviceDescription">Description</label>
          <textarea
            id="serviceDescription"
            name="serviceDescription"
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service description"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Add Service
        </button>
      </form>
    </div>
  )
}

export default AddService