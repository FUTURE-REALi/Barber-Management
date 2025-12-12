import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookOnline from '../components/StorePageComponents/BookOnline.jsx';
import Reviews from '../components/StorePageComponents/Reviews.jsx';
import Photos from '../components/StorePageComponents/Photos.jsx';
import ServiceMenu from '../components/StorePageComponents/ServiceMenu.jsx';

const StoreDetailPage = () => {
  const [storeData, setStoreData] = useState(null);
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

  if (isLoading || !storeData) {
    return (
      <div className='flex items-center justify-center h-screen w-full bg-gradient-to-br from-orange-50 to-red-50'>
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600"></div>
          <p className="mt-6 text-gray-700 font-semibold text-lg">Loading store details...</p>
        </div>
      </div>
    );
  }

  const {
    storename = '',
    services = [],
    address = {},
    openingTime = '',
    closingTime = '',
    phone = '',
    images = {},
  } = storeData;

  const tags = Array.isArray(services)
    ? services.map(s => s.service?.name || s.name || '').filter(Boolean).slice(0, 3)
    : [];

  let fullAddress = '';
  if (address && typeof address === 'object') {
    fullAddress = [address.building, address.city, address.state, address.zip]
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

  return (
    <div className="flex flex-col bg-gradient-to-br from-gray-50 via-orange-50/20 to-gray-50 min-h-screen">
      {/* Hero Section with Cover Image */}
      <div className="relative w-full h-[500px] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800"
          style={{
            backgroundImage: images.coverImage?.url ? `url('${images.coverImage.url}')` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        >
          {!images.coverImage?.url && (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-icons text-9xl text-white/20">storefront</span>
            </div>
          )}
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        </div>

        {/* Store Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-8 z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              {/* Left: Store Details */}
              <div className="flex-1">
                <h1 className="text-5xl md:text-6xl font-black text-white mb-4 tracking-tight drop-shadow-2xl">
                  {storename || 'Store Details'}
                </h1>
                
                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Address */}
                <div className="flex items-start gap-2 text-white/90 text-base mb-4 drop-shadow-lg">
                  <span className="material-icons text-xl mt-0.5">location_on</span>
                  <span className="font-medium">{fullAddress || 'Address not available'}</span>
                </div>

                {/* Status and Details */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  <span className="backdrop-blur-md bg-emerald-500/90 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                    Open Now
                  </span>
                  {openingTime && closingTime && (
                    <span className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-2 rounded-full font-semibold flex items-center gap-2 shadow-lg">
                      <span className="material-icons text-lg">schedule</span>
                      {openingTime} - {closingTime}
                    </span>
                  )}
                  <span className="backdrop-blur-md bg-white/20 border border-white/30 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                    ₹400 for two
                  </span>
                </div>
              </div>

              {/* Right: Rating Card */}
              <div className="backdrop-blur-lg bg-white/95 rounded-2xl shadow-2xl p-6 border border-white/50 min-w-[160px]">
                <div className="flex flex-col items-center">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-600 text-white px-6 py-3 rounded-xl font-black text-3xl flex items-center gap-2 shadow-lg mb-3">
                    {averageRating ? averageRating.toFixed(1) : '--'}
                    <span className="material-icons text-2xl">star</span>
                  </div>
                  <span className="text-gray-700 text-sm font-bold uppercase tracking-wide">Overall Rating</span>
                  <span className="text-gray-500 text-xs mt-1">Based on reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Left: Action Buttons */}
            <div className="flex flex-wrap gap-3">
              {phone && (
                <Link 
                  to={`tel:+91${phone}`}
                  className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="material-icons text-lg">call</span>
                  Call Now
                </Link>
              )}
              <button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                <span className="material-icons text-lg">directions</span>
                Directions
              </button>
            </div>

            {/* Right: Social Actions */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 border-2 border-gray-300 hover:border-orange-500 px-4 py-2.5 rounded-xl text-gray-700 hover:text-orange-600 transition-all font-semibold">
                <span className="material-icons text-lg">share</span>
                Share
              </button>
              <button
                className="flex items-center gap-2 border-2 border-orange-300 bg-orange-50 hover:bg-orange-100 px-4 py-2.5 rounded-xl text-orange-600 transition-all font-semibold"
                onClick={() => handleOptionClick('reviews')}
              >
                <span className="material-icons text-lg">rate_review</span>
                Write Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white shadow-md sticky top-[72px] z-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {[
              { key: 'bookonline', label: 'Book Online', icon: 'event_available' },
              { key: 'reviews', label: 'Reviews', icon: 'rate_review' },
              { key: 'photos', label: 'Photos', icon: 'collections' },
              { key: 'services', label: 'Services', icon: 'content_cut' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                className={`flex items-center gap-2 px-6 py-4 font-bold text-sm transition-all duration-300 border-b-4 whitespace-nowrap ${
                  option === key
                    ? 'border-orange-500 text-orange-600 bg-orange-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionClick(key)}
              >
                <span className="material-icons text-xl">{icon}</span>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {option === 'bookonline' && <BookOnline storeData={storeData} />}
          {option === 'reviews' && <Reviews storeData={storeData} />}
          {option === 'photos' && <Photos storeData={storeData} />}
          {option === 'services' && <ServiceMenu storeData={storeData} />}
        </div>
      </div>
    </div>
  );
};

export default StoreDetailPage;