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
    <div className="w-full bg-[#FFFFFF]">
      <nav className="bg-[#FFFFFF] py-3 px-6">
        <div className="container mx-auto flex justify-between items-center text-[#333333] font-inter max-h-[42px]">
          <div>
            <Link to="/" className="text-2xl hover:text-[#5A2C7B] ">
              <img
                src="/Logo.png"
                alt="PocketSalon Logo"
                className="h-16"
                style={{ backgroundColor: '#FFFFFF' }}
              />
            </Link>
          </div>
          <div className="flex space-x-8 text-lg items-center">
            <Link to="/" className="hover:text-[#5A2C7B] ">
              Home
            </Link>
            {/* Location Switcher */}
            <div className="relative hover:text-[#5A2C7B] ">
              <button
                className="flex items-center"
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
            <Link to="/history" className=" hover:text-[#5A2C7B] ">
              Appointments
            </Link>
            <Link to="/checkoutcart" className="hover:text-[#5A2C7B]  ">
              Salons
            </Link>
            <div className="relative">
              <Link
                to="/getuserprofile"
                className="  cursor-pointer"
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
          <div className='flex space-x-8 text-lg items-center'>
            <Link to="/" className="  flex items-center hover:text-[#5A2C7B] ">
              <span className="material-icons text-2xl">search</span>
            </Link>
            <Link to="/checkoutcart" className="  flex items-center hover:text-[#5A2C7B] ">
              <span className="material-icons text-2xl">shopping_cart</span>
            </Link>
            <Link to="/getuserprofile" className="flex items-center hover:text-[#5A2C7B]">
              <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-300 bg-white flex items-center justify-center">
                <img
                  src={userData?.profilePhoto || "https://reactjs.org/logo-og.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
            {/* Horizontal Toggle Button */}
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-orange-400 transition-colors"></div>
                <div className="absolute left-0 top-0 w-6 h-6 bg-white rounded-full shadow peer-checked:translate-x-6 transition-transform"></div>
              </div>
              <span className="ml-2 ">Dark</span>
            </label>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;