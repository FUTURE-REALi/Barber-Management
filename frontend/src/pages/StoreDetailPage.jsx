import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookOnline from '../components/StorePageComponents/BookOnline.jsx';
import Reviews from '../components/StorePageComponents/Reviews.jsx';
import Photos from '../components/StorePageComponents/Photos.jsx';
import ServiceMenu from '../components/StorePageComponents/ServiceMenu.jsx';

const renderStars = (rating) => {
  const rounded = Math.round(rating || 0);
  return (
    <span className="ml-1 text-white">
      ★
    </span>
  );
};

const StoreDetailPage = () => {
  const [storeData, setStoreData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(null);

  const navigate = useNavigate();
  const { storeId, option = 'bookonline', storeName } = useParams();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/get-store/${storeId}`);
        if (response.status === 200 && response.data.store) {
          setStoreData(response.data.store);
        } else {
          navigate('/');
        }
      } catch (error) {
        navigate('/');
      } finally {
        setIsLoading(false);
      }
    };
    if (storeId) fetchStoreDetails();
  }, [storeId, navigate]);

  useEffect(() => {
    const fetchStoreRating = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/average-rating/${storeId}`);
        if (response.status === 200) {
          setAverageRating(response.data.average);
        }
      } catch (error) {
        setAverageRating(null);
      }
    };
    if (storeId) fetchStoreRating();
  }, [storeId]);

  const {
    storename = '',
    services = [],
    address = {},
    openingTime = '',
    closingTime = '',
    phone = ''
  } = storeData;

  const handleOptionClick = (selectedOption) => {
    const basePath = `/store/${storeId}/${storeName}`;
    const optionPath = selectedOption.toLowerCase().replace(/\s+/g, '');
    navigate(`${basePath}/${optionPath}`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <p>Loading...</p>
      </div>
    );
  }

  // Compose tags from services
  const tags = services.map(s => s.name).join(', ');
  // Compose address
  const fullAddress = [address.building, address.street, address.city, address.state, address.zipcode].filter(Boolean).join(', ');

  return (
    <div className="flex flex-col items-center bg-white min-h-screen w-full">
      <div className="flex flex-col items-center w-280">
        {/* Store Header Section */}
      <div className="w-full px-10 py-8 flex flex-col gap-2 border-b">
        <div className="flex flex-row items-start justify-between w-full">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{storename || 'Store Details'}</h1>
            <div className="mt-2 text-lg text-gray-500">{tags}</div>
            <div className="mt-1 text-base text-gray-400">{fullAddress}</div>
            <div className="flex items-center gap-2 mt-3">
              <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-sm font-semibold">Open now</span>
              <span className="text-gray-500 text-sm">
                {openingTime && closingTime ? `${openingTime} - ${closingTime}` : ''}
                {openingTime && closingTime ? ' (Today)' : ''}
              </span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-gray-700 font-medium">₹400 for two</span>
              <span className="mx-2 text-gray-400">|</span>
              <span className="text-pink-600 font-semibold">
                <Link to={`tel:${phone}`}>{phone && `+91${phone}`}</Link>
              </span>
            </div>
          </div>
          {/* Ratings */}
          <div className="flex flex-row gap-8">
            <div className="flex flex-col items-center">
              <span className="bg-green-600 text-white px-3 py-1 rounded font-semibold flex items-center text-lg">
                {averageRating ? averageRating.toFixed(1) : '--'}
                {renderStars(averageRating)}
              </span>
              <span className="text-gray-600 text-xs mt-1">Dining Ratings</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="bg-green-600 text-white px-3 py-1 rounded font-semibold flex items-center text-lg">
                {averageRating ? averageRating.toFixed(1) : '--'}
                {renderStars(averageRating)}
              </span>
              <span className="text-gray-600 text-xs mt-1">Delivery Ratings</span>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex flex-row gap-4 mt-6">
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <span>📍</span> Direction
          </button>
          <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100">
            <span>🔗</span> Share
          </button>
          <button
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => handleOptionClick('reviews')}
          >
            <span>💬</span> Reviews
          </button>
        </div>
      </div>
      {/* Tabs Section */}
      <div className='flex items-center justify-start gap-10 bg-white shadow-lg rounded-lg px-16 w-full py-4 mt-4'>
        {['bookonline', 'reviews', 'photos', 'services'].map(opt => (
          <button
            key={opt}
            className={`px-4 py-2 rounded-lg border-b-2 ${option === opt ? 'border-b-amber-900' : 'border-b-amber-200'} text-gray-700 hover:bg-gray-100`}
            onClick={() => handleOptionClick(opt)}
            style={{cursor: 'pointer', transition: 'border-color 0.3s ease'}}
          >
            {opt.charAt(0).toUpperCase() + opt.slice(1)}
          </button>
        ))}
      </div>
      <hr />
      {/* Content Section */}
      <div className='flex items-center justify-start w-full py-4'>
        {option === 'bookonline' && <BookOnline storeId={storeId} />}
        {option === 'reviews' && <Reviews storeId={storeId} services={services} />}
        {option === 'photos' && <Photos storeId={storeId} />}
        {option === 'services' && <ServiceMenu services={services} />}
      </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;