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
      {'★'.repeat(rounded) || '★'}
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
    phone = '',
    imageUrl = ''
  } = storeData;

  // Compose tags from services
  const tags = Array.isArray(services)
    ? services.map(s => s.service?.name || s.name || '').filter(Boolean).slice(0, 3).join(', ')
    : '';

  // Compose address
  let fullAddress = '';
  if (address && typeof address === 'object') {
    fullAddress = [address.building, address.street, address.city, address.state, address.zipcode]
      .filter(Boolean)
      .join(', ');
  } else if (typeof address === 'string') {
    fullAddress = address;
  }

  const handleOptionClick = (selectedOption) => {
    const basePath = `/store/${storeId}/${storeName}`;
    const optionPath = selectedOption.toLowerCase().replace(/\s+/g, '');
    navigate(`${basePath}/${optionPath}`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen w-full bg-gray-50'>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center bg-gray-50 min-h-screen w-full">
      {/* Store Header with Background Image */}
      <div className="w-full bg-white shadow-sm relative">
        {/* Store Banner Image - Background */}
        <div 
          className="w-full h-72 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden absolute top-0 left-0 z-0"
          style={{
            backgroundImage: imageUrl ? `url('${imageUrl}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {!imageUrl && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-icons text-6xl text-gray-400">image</span>
            </div>
          )}
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Store Info Section - Foreground */}
        <div className="px-8 py-6 relative z-10 pt-20">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
            {/* Left: Store Details */}
            <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{storename || 'Store Details'}</h1>
              
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {tags.split(', ').map((tag, idx) => (
                  <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Address */}
              <div className="flex items-start gap-2 text-gray-600 text-sm mb-4">
                <span className="material-icons text-base mt-1">location_on</span>
                <span>{fullAddress}</span>
              </div>

              {/* Status and Details */}
              <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold flex items-center gap-1">
                  <span className="material-icons text-base">check_circle</span>
                  Open now
                </span>
                {openingTime && closingTime && (
                  <span className="text-gray-700 flex items-center gap-1">
                    <span className="material-icons text-base">schedule</span>
                    {openingTime} - {closingTime}
                  </span>
                )}
                <span className="text-gray-500">|</span>
                <span className="font-medium text-gray-800">₹400 for two</span>
              </div>

              {/* Call Button */}
              {phone && (
                <Link 
                  to={`tel:+91${phone}`}
                  className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  <span className="material-icons text-lg">phone</span>
                  Call +91{phone}
                </Link>
              )}
            </div>

            {/* Right: Ratings */}
            <div className="flex gap-8">
              <div className="flex flex-col items-center bg-white rounded-lg shadow-lg px-6 py-4 border border-gray-200">
                <span className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold text-xl flex items-center gap-1">
                  {averageRating ? averageRating.toFixed(1) : '--'}
                  <span className="material-icons text-lg">star</span>
                </span>
                <span className="text-gray-700 text-xs font-semibold mt-2">Overall Rating</span>
                <span className="text-gray-500 text-xs mt-1">Based on reviews</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 bg-white rounded-lg shadow-lg p-6 relative z-10">
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <span className="material-icons text-lg">directions</span>
              Direction
            </button>
            <button className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium">
              <span className="material-icons text-lg">share</span>
              Share
            </button>
            <button
              className="flex items-center gap-2 border border-orange-300 bg-orange-50 px-4 py-2 rounded-lg text-orange-700 hover:bg-orange-100 transition-colors font-medium"
              onClick={() => handleOptionClick('reviews')}
            >
              <span className="material-icons text-lg">rate_review</span>
              Reviews
            </button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="w-full bg-white border-b sticky top-0 z-20 shadow-sm">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex items-center gap-8">
            {['bookonline', 'reviews', 'photos', 'services'].map(opt => (
              <button
                key={opt}
                className={`py-4 px-2 font-semibold text-sm transition-all duration-200 border-b-2 ${
                  option === opt
                    ? 'border-b-orange-500 text-orange-600'
                    : 'border-b-transparent text-gray-700 hover:text-gray-900'
                }`}
                onClick={() => handleOptionClick(opt)}
              >
                {opt === 'bookonline' && <span className="flex items-center gap-1"><span className="material-icons text-base">shopping_cart</span>Book Online</span>}
                {opt === 'reviews' && <span className="flex items-center gap-1"><span className="material-icons text-base">rate_review</span>Reviews</span>}
                {opt === 'photos' && <span className="flex items-center gap-1"><span className="material-icons text-base">image</span>Photos</span>}
                {opt === 'services' && <span className="flex items-center gap-1"><span className="material-icons text-base">category</span>Services</span>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="w-full max-w-6xl mx-auto px-8 py-6">
        {option === 'bookonline' && <BookOnline storeId={storeId} />}
        {option === 'reviews' && <Reviews storeId={storeId} services={services} />}
        {option === 'photos' && <Photos storeId={storeId} />}
        {option === 'services' && <ServiceMenu services={services} />}
      </div>
    </div>
  );
};

export default StoreDetailPage;