import React, { useContext, useEffect, useState } from 'react';
import { StoreDataContext } from '../context/StoreContext';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SetupPage1 from '../components/StoreSetupComponents/SetupPage1';
import SetupPage2 from '../components/StoreSetupComponents/SetupPage2';
import SetupPage3 from '../components/StoreSetupComponents/SetupPage3';

const StoreSetup = () => {
  const token = localStorage.getItem('token');
  const { storeData, setStoreData } = useContext(StoreDataContext);

  const [storename, setStoreName] = useState('');
  const [ownername, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [building, setBuilding] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
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
      services: selectedServices,
    };

    axios.put(`${import.meta.env.VITE_BASE_URL}/stores/update-store`, newStore, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (response.status === 200) {
          setStoreData(response.data);
          console.log('Store updated successfully:', response.data);
          console.log('storeServices:', selectedServices);
          navigate('/store/dashboard');
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Use URL parameter for step navigation
  const { step: stepParam } = useParams();
  const activeStep = parseInt(stepParam) || 1;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (activeStep < 3) {
      navigate(`/setupstore/${activeStep + 1}`);
    }
  };

  const handlePreviousStep = (e) => {
    e.preventDefault();
    if (activeStep > 1) navigate(`/setupstore/${activeStep - 1}`);
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
            {activeStep === 1 && (
              <SetupPage1
                storename={storename}
                setStoreName={setStoreName}
                ownername={ownername}
                setOwnerName={setOwnerName}
                email={email}
                setEmail={setEmail}
                phone={phone}
                setPhone={setPhone}
                building={building}
                setBuilding={setBuilding}
                city={city}
                setCity={setCity}
                state={state}
                setState={setState}
                zip={zip}
                setZip={setZip}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                activeStep={activeStep}
              />
            )}

            {activeStep === 2 && (
              <SetupPage2
                openingTime={openingTime}
                setOpeningTime={setOpeningTime}
                closingTime={closingTime}
                setClosingTime={setClosingTime}
                handleNextStep={handleNextStep}
                handlePreviousStep={handlePreviousStep}
                activeStep={activeStep}
              />
            )}

            {activeStep === 3 && (
              <SetupPage3
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
                handleFinalSubmit={handleFinalSubmit}
                handlePreviousStep={handlePreviousStep}
                activeStep={activeStep}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSetup;