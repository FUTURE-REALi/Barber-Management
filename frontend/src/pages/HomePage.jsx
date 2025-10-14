import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import SearchBox from '../components/HomePageComponents/SearchBox';
import SalonMap from '../components/MapComponents/SalonMap';

const HomePage = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [userServices, setUserServices] = useState([]);
  const [userStores, setUserStores] = useState([]);
  const [topStores, setTopStores] = useState([]);
  const [filterType, setFilterType] = useState('none');
  const { userData } = useContext(UserDataContext);

  // Get user's current location using browser geolocation
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        () => {
          setUserLocation(null); // fallback if denied
        }
      );
    }
  }, []);

  useEffect(() => {
    fetchStores();
    fetchUserHistory();
  }, []);

  // Fetch all stores
  const fetchStores = async (query = '') => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/getallstores`);
      let allStores = response.data.stores;
      if (query) {
        allStores = allStores.filter(store =>
          store.storename.toLowerCase().includes(query.toLowerCase())
        );
      }
      setStores(allStores);
      setFilteredStores(allStores);
      // Top rated stores (top 6)
      const sorted = [...allStores].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      setTopStores(sorted.slice(0, 6));
    } catch {
      setStores([]);
      setFilteredStores([]);
      setTopStores([]);
    }
  };

  // Fetch user's previous bookings/services and stores
  const fetchUserHistory = async () => {
    if (!userData?._id) return;
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/bookings/user/${userData._id}`
      , {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      if (res.data && Array.isArray(res.data)) {
        // Get unique services and stores from bookings
        const services = [];
        const stores = [];
        res.data.forEach(b => {
          if (Array.isArray(b.service)) {
        b.service.forEach(svc => {
          if (svc && !services.find(s => s._id === svc._id)) {
            services.push(svc);
          }
        });
          } else if (b.service && !services.find(s => s._id === b.service._id)) {
        services.push(b.service);
          }
          if (b.store && !stores.find(s => s._id === b.store._id)) {
        stores.push(b.store);
          }
        });
        setUserServices(services);
        setUserStores(stores);
      }
    } catch {
      setUserServices([]);
      setUserStores([]);
    }
  };

  // Search handler
  const handleSearch = (e) => {
    e.preventDefault();
    fetchStores(searchQuery);
  };

  // Filtering logic (apply rating/service filters only)
  useEffect(() => {
    let filtered = [...stores];
    if (filterType === 'rating') {
      filtered = filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (filterType === 'service') {
      if (userServices.length > 0) {
        filtered = filtered.filter(store =>
          store.services &&
          store.services.some(s =>
            userServices.some(us => us._id === s._id)
          )
        );
      }
    }
    setFilteredStores(filtered);
  }, [filterType, stores, userServices]);

  // Merge top stores and user's previously chosen stores (no duplicates)
  const mergedTopStores = [];
  const seen = new Set();

  userStores.forEach(store => {
    if (store && store._id && !seen.has(store._id.toString())) {
      mergedTopStores.push(store);
      seen.add(store._id.toString());
    }
  });
  topStores.forEach(store => {
    if (store && store._id && !seen.has(store._id.toString())) {
      mergedTopStores.push(store);
      seen.add(store._id.toString());
    }
  });

  const mergedTopStoresLimited = mergedTopStores.slice(0, 6);

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Top bar with centered search */}
      <div className="w-full bg-white shadow-sm px-4 py-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex justify-center">
          <div className="w-[1000px]">
            <SearchBox
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={handleSearch}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-5xl mx-auto mt-6 flex gap-4">
        <button
          className={`border px-4 py-1 rounded-full text-gray-700 bg-white shadow-sm flex items-center gap-2 ${
            filterType === 'none' ? 'border-red-400 text-red-500' : ''
          }`}
          onClick={() => setFilterType('none')}
        >
          <span className="material-icons text-base">filter_list</span> All
        </button>
        <button
          className={`border px-4 py-1 rounded-full text-gray-700 bg-white shadow-sm ${
            filterType === 'rating' ? 'border-red-400 text-red-500' : ''
          }`}
          onClick={() => setFilterType('rating')}
        >
          Highest Rating
        </button>
        <button
          className={`border px-4 py-1 rounded-full text-gray-700 bg-white shadow-sm ${
            filterType === 'service' ? 'border-red-400 text-red-500' : ''
          }`}
          onClick={() => setFilterType('service')}
        >
          Services You Booked
        </button>
      </div>

      {/* User's previously booked services */}
      <div className="max-w-5xl mx-auto mt-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Choose services you like the most.</h2>
        {userServices.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No previous services found.</div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-2">
            {userServices.length > 0 ? (
              userServices.map(s => (
                <div key={s._id} className="flex flex-col items-center min-w-[90px]">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow">
                    <img src={s.image || "/service.jpg"} alt={s.service.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 text-center">{s.service.name}</span>
                </div>
              ))
            ) : (
              userServices.map(service => (
                <div key={service._id} className="flex flex-col items-center min-w-[90px]">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 shadow">
                    <img src={service.image || "/service.jpg"} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="mt-2 text-sm font-medium text-gray-700 text-center">{service.name}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Top stores for you */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Top stores for you</h2>
        {mergedTopStoresLimited.length === 0 ? (
          <div className="text-gray-400 text-center py-8">No top stores found.</div>
        ) : (
          <div className="flex gap-8 overflow-x-auto pb-2">
            {mergedTopStoresLimited.map(store => (
              <div key={store._id} className="flex flex-col items-center min-w-[90px]">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white border-2 border-gray-200 shadow flex items-center justify-center">
                  <img src={store.imageUrl || "/a.jpg"} alt={store.storename} className="w-14 h-14 object-contain" />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700 text-center">{store.storename}</span>
                <span className="text-xs text-gray-400">{store.rating ? `${store.rating}★` : ""}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="max-w-5xl mx-auto mt-8 mb-8">
        <SalonMap stores={filteredStores} userLocation={userLocation} />
      </div>

      {/* Store Cards */}
      <div className="max-w-5xl mx-auto mt-10">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Salons in Allahabad
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredStores.length === 0 ? (
            <p className="text-gray-500 col-span-full">No salons found.</p>
          ) : (
            filteredStores.map(store => (
              <div
                key={store._id}
                className="bg-white rounded-xl shadow-md overflow-hidden flex flex-col hover:shadow-lg transition"
              >
                <div className="relative">
                  <img
                    src={store.imageUrl || "/a.jpg"}
                    alt={store.storename}
                    className="h-40 w-full object-cover"
                  />
                  {/* Example badge */}
                  {store.isPromoted && (
                    <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      PROMOTED
                    </span>
                  )}
                  {/* Example rating */}
                  <span className="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
                    {store.rating ? store.rating : "4.2"}
                  </span>
                  {/* Example distance */}
                  {typeof store.distance === 'number' && (
                    <span className="absolute bottom-2 right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-80">
                      {store.distance} km
                    </span>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-lg text-gray-800">{store.storename}</h3>
                  <p className="text-gray-600 text-sm">{store.address?.city || 'Unknown City'}</p>
                  <p className="text-gray-400 text-xs mt-1 truncate">
                    {store.categories?.join(", ") || "Salon, Spa, Beauty"}
                  </p>
                  <div className="mt-auto">
                    <Link
                      to={`/store/${store._id}/${store.storename}`}
                      className="mt-3 inline-block text-blue-600 hover:underline text-sm font-semibold"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;