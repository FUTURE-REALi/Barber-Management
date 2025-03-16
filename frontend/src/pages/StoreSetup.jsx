import React, { useContext, useEffect, useState } from 'react';
import { StoreDataContext } from '../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const StoreSetup = () => {
  const token = localStorage.getItem('token');
  const { storeData, setStoreData } = useContext(StoreDataContext);

  const [step, setStep] = useState(1);

  const [storename, setStoreName] = useState('');
  const [ownername, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [building, setBuilding] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [services, setServices] = useState([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  const navigate = useNavigate();


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

    if (storeData) {
      setStoreName(storeData.storename || '');
      setOwnerName(storeData.ownername || '');
      setEmail(storeData.email || '');
      setPhone(storeData.phone || '');
      setBuilding(storeData.address?.building || '');
      setCity(storeData.address?.city || '');
      setState(storeData.address?.state || '');
      setZip(storeData.address?.zip || '');
      setOpeningTime(storeData.openingTime || '');
      setClosingTime(storeData.closingTime || '');
    }
  }, [storeData]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    const newStore = {
      storename,
      ownername,
      email,
      address: { building, city, state, zip },
      phone,
      openingTime,
      closingTime,
    };

    axios.put(`${import.meta.env.VITE_BASE_URL}/stores/update-store`, newStore, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status === 200) {
          setStoreData(response.data);
          navigate('/store/dashboard');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className='min-h-screen w-full'>
      <div className='flex flex-col min-h-screen w-full'>
        <div className='flex flex-col justify-between w-full p-4 md:p-8'>
          <div className='flex flex-col gap-2 text-center mb-4'>
            <h1 className='text-2xl md:text-3xl font-bold text-gray-700'>
              Welcome to PocketSalon
            </h1>
            <h2 className='text-lg md:text-xl font-semibold'>
              Lets set up your store
            </h2>
          </div>

          <div className='flex flex-col gap-4'>
            {step === 1 && (
              <form className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>                  <div>
                    <label className='text-lg'>Store Name</label>
                    <input
                      value={storename}
                      onChange={(e) => setStoreName(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='text'
                      placeholder='Enter your store name'
                    />
                  </div>
                  <div>
                    <label className='text-lg'>Owner Name</label>
                    <input
                      value={ownername}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='text'
                      placeholder="Enter store Owner's name"
                    />
                  </div>
                  <div>
                    <label className='text-lg'>Phone Number</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='text'
                      placeholder='Enter your store phone number'
                    />
                  </div>
                  <div>
                    <label className='text-lg'>Store Email</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='text'
                      placeholder='Enter your store email'
                    />
                  </div>
                </div>
                <div className='flex flex-col gap-2'>
                  <h2 className='text-xl mb-2'>Store Address:</h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                      <label className='text-base'>Street Address</label>
                      <input
                        value={building}
                        onChange={(e) => setBuilding(e.target.value)}
                        className='w-full p-2 text-sm border border-gray-300 rounded-md'
                        type='text'
                        placeholder='Enter your store street address'
                      />
                    </div>
                    <div>
                      <label className='text-base'>City</label>
                      <input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className='w-full p-2 text-sm border border-gray-300 rounded-md'
                        type='text'
                        placeholder='Enter your store city'
                      />
                    </div>
                    <div>
                      <label className='text-base'>State</label>
                      <input
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className='w-full p-2 text-sm border border-gray-300 rounded-md'
                        type='text'
                        placeholder='Enter your store state'
                      />
                    </div>
                    <div>
                      <label className='text-base'>Zip Code</label>
                      <input
                        value={zip}
                        onChange={(e) => setZip(e.target.value)}
                        className='w-full p-2 text-sm border border-gray-300 rounded-md'
                        type='text'
                        placeholder='Enter your store zip code'
                      />
                    </div>
                  </div>
                </div>

                <div className='flex gap-4'>
                  <button
                    className='w-full p-2 text-sm font-semibold text-blue-500 bg-white border border-blue-500 rounded-md'
                    type='button'
                  >
                    Previous
                  </button>
                  <button
                    className='w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                    type='button'
                    onClick={handleNextStep}
                  >
                    Next
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-lg'>Opening Time</label>
                    <input
                      value={openingTime}
                      onChange={(e) => setOpeningTime(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='time'
                    />
                  </div>
                  <div>
                    <label className='text-lg'>Closing Time</label>
                    <input
                      value={closingTime}
                      onChange={(e) => setClosingTime(e.target.value)}
                      className='w-full p-2 text-sm border border-gray-300 rounded-md'
                      type='time'
                    />
                  </div>
                </div>

                <div className='flex gap-4'>
                  <button
                    className='w-full p-2 text-sm font-semibold text-blue-500 bg-white border border-blue-500 rounded-md'
                    type='button'
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                  <button
                    className='w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                    type='submit'
                    onClick={handleNextStep}
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <form className='flex flex-col gap-4'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='text-lg'>Select Services</label>
                    {services.map((service) => (
                      <div key={service._id}>
                        <label className='text-base'>
                          <input
                            type='checkbox'
                            value={service._id}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedServices((prev) => [...prev, e.target.value]);
                              } else {
                                setSelectedServices((prev) =>
                                  prev.filter((s) => s !== e.target.value)
                                );
                              }
                            }}
                          />
                          {service.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className='flex gap-4'>
                  <button
                    className='w-full p-2 text-sm font-semibold text-blue-500 bg-white border border-blue-500 rounded-md'
                    type='button'
                    onClick={handlePreviousStep}
                  >
                    Previous
                  </button>
                  <button
                    className='w-full p-2 text-sm font-semibold text-white bg-blue-500 rounded-md'
                    type='submit'
                    onClick={handleFinalSubmit}
                  >
                    Save and Continue
                  </button>
                </div>
              </form>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSetup;