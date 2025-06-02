import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddService from './AddService.jsx';

const SetupPage3 = ({
  selectedServices,
  setSelectedServices,
  handleFinalSubmit,
  handlePreviousStep,
  activeStep
}) => {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/services/get-services`);
      if (response.status === 200) {
        setServices(response.data);
      }
    } catch (error) {
      // handle error if needed
    }
  };

  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  // Handler for AddService form submission
  const handleAddServiceSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      // 1. Add the service globally
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/services/add-service`, formData);
      if (response.status === 201 && response.data && response.data._id) {
        const newServiceId = response.data._id;

        setSelectedServices(prev => [...prev, newServiceId]);
        setShowAddService(false);
        fetchServices();
      } else {
        alert('Failed to add service.');
      }
    } catch (err) {
      alert('Failed to add service.');
    }
  };

  // When user clicks Finish, add all selected services to StoreService
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Store authentication failed. Please log in again.');
      return;
    }
    const price = 0;
    const duration = 30;
    try {
      for (const serviceId of selectedServices) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/stores/add-store-service`,
          {
            service: serviceId,
            price,
            duration
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
      }
      handleFinalSubmit(e);
    } catch (err) {
      alert('Failed to add one or more services to the store.');
    }
  };

  return (
    <form
      className="max-w-2xl mx-auto bg-white shadow-2xl rounded-2xl p-10 flex flex-col gap-10"
      onSubmit={handleSubmit}
    >
      <h2 className="text-3xl font-extrabold text-blue-900 mb-2 text-center tracking-tight">Select Services</h2>
      <div>
        <h3 className="font-semibold text-lg text-gray-700 mb-4">Which services does your store offer?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          {services.length === 0 ? (
            <span className="text-gray-400">No services found.</span>
          ) : (
            services.map(service => (
              <label
                key={service._id}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                  ${selectedServices.includes(service._id)
                    ? 'bg-blue-100 border-blue-500 shadow'
                    : 'bg-gray-50 border-gray-200 hover:border-blue-300'}
                `}
              >
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service._id)}
                  onChange={() => handleServiceToggle(service._id)}
                  className="accent-blue-600 w-5 h-5"
                />
                <span className="text-gray-900 font-medium text-lg">{service.name}</span>
              </label>
            ))
          )}
        </div>
      </div>
      {/* Add Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div>
            <AddService
              onClose={() => setShowAddService(false)}
              onSubmit={handleAddServiceSubmit}
            />
          </div>
        </div>
      )}
      {/* Bottom Buttons */}
      <div className="flex flex-col md:flex-row gap-4 justify-end items-center mt-4">
        <button
          type="button"
          className="btn btn-outline border-blue-600 text-blue-700 hover:bg-blue-50 px-6 py-2 rounded-lg font-semibold"
          onClick={handlePreviousStep}
        >
          Previous
        </button>
        <button
          type="button"
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold shadow"
          onClick={() => setShowAddService(true)}
        >
          + Add Service
        </button>
        <button
          type="submit"
          className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-lg font-semibold shadow"
        >
          Finish
        </button>
      </div>
    </form>
  );
};

export default SetupPage3;