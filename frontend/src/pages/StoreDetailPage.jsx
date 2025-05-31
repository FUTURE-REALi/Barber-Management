import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import BookOnline from '../components/StorePageComponents/BookOnline.jsx';
import Reviews from '../components/StorePageComponents/Reviews.jsx';
import Photos from '../components/StorePageComponents/Photos.jsx';
import ServiceMenu from '../components/StorePageComponents/ServiceMenu.jsx';

const optionItems = ['bookonline', 'reviews', 'photos', 'services'];

const StoreDetailPage = () => {
  const [storeData, setStoreData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { storeId, option, storeName } = useParams();

  useEffect(() => {
    const fetchStoreDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/get-store/${storeId}`);
        if (response.status === 200) {
          const store = response.data.store;
          setStoreData(store);
          if (!store) {
            console.error('Store not found');
            navigate('/'); // Redirect to home if store not found
          }
        } else {
          console.error('Failed to fetch store details');
        }
      } catch (error) {
        console.error('Error fetching store details:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStoreDetails();
  }
  , [storeId, navigate]);

  const { storename, rating, services, address, openingTime, closingTime, phone } = storeData;

  const handleOptionClick = (option) => {
    const basePath = `/store/${storeId}/${storeName}`;
    const optionPath = option.toLowerCase().replace(/\s+/g, '');
    navigate(`${basePath}/${optionPath}`);
  };

  if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen w-full'>
        <p>Loading...</p>
      </div>
    );
  }
  return (
    <div className='flex flex-col items-center justify-center bg-gray-100 h-screen w-full'>
      <div className='flex flex-col items-center justify-start w-280 h-full'>
        <div className='flex flex-col bg-gray-100 w-full px-16'>
          <div className='flex items-center justify-between py-5 '>
            <div>
              <h1>
                {storename ? `${storename}` : 'Store Details'}
              </h1>
            </div>
            <div>
              <p>
                {rating ? `Rating: ${rating}` : 'No rating available'}
              </p>
            </div>
          </div>
          <div className='flex gap-2'>
            {services && services.map((service, index) => (
              <h4 key={index}>
                {service.name}
                {index !== services.length - 1 && ','}
              </h4>
            ))}
          </div>
          <div>
            <h3>
              {address.building}, {address.street}, {address.city}, {address.state}, {address.zipcode}
            </h3>
          </div>
          <div className="flex items-center justify-start gap-4">
            <div className="flex items-center justify-between border-2 border-gray-300 rounded-lg px-2 py-2">
              <h3>Timmings: </h3>
              <p>{openingTime} - {closingTime}</p>
            </div>
            <div>
              <h3>Pricing</h3>
            </div>
            <div>
              <h3>
                +91-{<Link to={`tel:${phone}`}>{phone}</Link>}
              </h3>
            </div>
          </div>
        </div>
        <div className='flex items-center justify-start gap-10 bg-white shadow-lg rounded-lg px-16 w-full py-4'>
          <button
            className={`px-4 py-2 rounded-lg ${option === 'bookonline' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleOptionClick('bookonline')}
          >
            Book Online
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${option === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleOptionClick('reviews')}
          >
            Reviews
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${option === 'photos' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleOptionClick('photos')}
          >
            Photos
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${option === 'services' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => handleOptionClick('services')}
          >
            Services
          </button>
        </div>
        <hr />
        <div className='flex items-center justify-start w-full px-16 py-4'>
          {option === 'bookonline' && <BookOnline storeId={storeId} />}
          {option === 'reviews' && <Reviews storeId={storeId}  services={services} />}
          {option === 'photos' && <Photos storeId={storeId} />}
          {option === 'services' && <ServiceMenu services={services} />}
        </div>
      </div>
    </div>
  )
}

export default StoreDetailPage