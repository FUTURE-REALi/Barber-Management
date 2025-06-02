import React, { useState } from 'react';

const AddService = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    serviceName: '',
    serviceDescription: '',
    price: '',
    duration: ''
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(e, {
      name: form.serviceName,
      description: form.serviceDescription,
      price: Number(form.price),
      duration: Number(form.duration)
    });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Add New Service</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="serviceName">Service Name</label>
          <input
            type="text"
            id="serviceName"
            name="serviceName"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter service name"
            value={form.serviceName}
            onChange={handleChange}
            required
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
            value={form.serviceDescription}
            onChange={handleChange}
          ></textarea>
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="price">Price (₹)</label>
          <input
            type="number"
            id="price"
            name="price"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter price"
            value={form.price}
            onChange={handleChange}
            min="0"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 mb-2" htmlFor="duration">Duration (minutes)</label>
          <input
            type="number"
            id="duration"
            name="duration"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter duration"
            value={form.duration}
            onChange={handleChange}
            min="1"
            required
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="w-1/2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="w-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-200"
            onClick={handleSubmit}
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddService;