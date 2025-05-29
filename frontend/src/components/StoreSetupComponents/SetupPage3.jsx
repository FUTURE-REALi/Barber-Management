import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SetupPage3 = ({
  selectedServices,
  setSelectedServices,
  handleFinalSubmit,
  handlePreviousStep,
  activeStep
}) => {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_BASE_URL}/services/get-services`)
      .then((response) => {
        if (response.status === 200) {
          setServices(response.data);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  return (
    <form
      className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 flex flex-col gap-8"
      onSubmit={handleFinalSubmit}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">Select Services</h2>
      <div>
        <h3 className="font-semibold mb-4 text-gray-700">Which services does your store offer?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map(service => (
            <label
              key={service._id}
              className={`flex items-center gap-3 p-3 rounded-lg border transition
                ${selectedServices.includes(service._id)
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-gray-50 border-gray-200 hover:border-blue-300'}
              `}
            >
              <input
                type="checkbox"
                checked={selectedServices.includes(service._id)}
                onChange={() => handleServiceToggle(service._id)}
                className="checkbox checkbox-primary"
              />
              <span className="text-gray-800 font-medium">{service.name}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="flex gap-4 justify-end mt-4">
        <button
          type="button"
          className="btn btn-outline"
          onClick={handlePreviousStep}
        >
          Previous
        </button>
        <button
          type="submit"
          className="btn btn-primary px-8"
        >
          Finish
        </button>
      </div>
    </form>
  );
};

export default SetupPage3;