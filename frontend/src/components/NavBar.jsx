import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';

const NavBar = () => {
  const [username, setUsername] = useState('Login');
  const { userData, setUserData } = useContext(UserDataContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [selectedLocationIdx, setSelectedLocationIdx] = useState(0);
  const navigate = useNavigate();

  // Set username
  useEffect(() => {
    if (userData && userData.username) {
      setUsername(userData.username);
    } else {
      setUsername('Login');
    }
  }, [userData]);

  // Set selected location index from localStorage or default
  useEffect(() => {
    if (userData?.address?.length) {
      const idx = Number(localStorage.getItem('selectedLocationIdx')) || 0;
      setSelectedLocationIdx(idx < userData.address.length ? idx : 0);
    }
  }, [userData]);

  // Handle location switch
  const handleLocationSwitch = idx => {
    setSelectedLocationIdx(idx);
    localStorage.setItem('selectedLocationIdx', idx);
    // Optionally, update context or trigger a reload in HomePage
    window.dispatchEvent(new Event('user-location-changed'));
    setShowLocationDropdown(false);
    navigate('/');
  };

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const toggleLocationDropdown = () => setShowLocationDropdown(!showLocationDropdown);

  return (
    <div className="w-full bg-[#FFA725]">
      <nav className="bg-[#FFA725] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            PocketSalon
          </Link>
          <div className="flex space-x-4 text-lg items-center">
            <Link to="/" className="text-white hover:text-gray-400">
              Home
            </Link>
            {/* Location Switcher */}
            <div className="relative">
              <button
                className="text-white hover:text-gray-400 flex items-center"
                onClick={toggleLocationDropdown}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 150)}
              >
                Location
                <span className="ml-1 material-icons text-base">expand_more</span>
              </button>
              {showLocationDropdown && userData?.address?.length > 0 && (
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-md shadow-lg z-50">
                  {userData.address.map((addr, idx) => (
                    <button
                      key={idx}
                      className={`block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                        selectedLocationIdx === idx ? 'bg-orange-100 font-semibold' : ''
                      }`}
                      onClick={() => handleLocationSwitch(idx)}
                    >
                      {addr.building}, {addr.street}, {addr.city}, {addr.state}
                    </button>
                  ))}
                  <Link
                    to="/getuserprofile"
                    className="block px-4 py-2 text-blue-600 hover:bg-gray-100 border-t"
                  >
                    Manage Addresses
                  </Link>
                </div>
              )}
            </div>
            <Link to="/history" className="text-white hover:text-gray-400">
              History
            </Link>
            <Link to="/checkoutcart" className="text-white hover:text-gray-400">
              Checkout Cart
            </Link>
            <div className="relative">
              <Link
                to="/getuserprofile"
                className="text-white hover:text-gray-400 cursor-pointer"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
              >
                {username}
              </Link>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50">
                  <Link to="/getuserprofile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Profile
                  </Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Settings
                  </Link>
                  <Link to="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                    Logout
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;