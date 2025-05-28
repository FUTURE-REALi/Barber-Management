import React, { useContext, useEffect, useState } from 'react';
import { Link, redirect } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext';
const NavBar = () => {
  const [username, setUsername] = useState('Login');
  const {userData} = useContext(UserDataContext);

  useEffect(() => {
    if (userData && userData.username) {
      setUsername(userData.username);
    } else {
      setUsername('Login');
    }
  }, [userData]);

  const [showDropdown, setShowDropdown] = useState(false);
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  }
  return (
    <div classname = "w-full bg-[#FFA725] p-4">
      <nav className="bg-[#FFA725] p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            PocketSalon
          </Link>
          <div className="flex space-x-4 text-lg">
            <Link to="/" className="text-white hover:text-gray-400">
              Home
            </Link>
            <Link to="/area" className="text-white hover:text-gray-400">
              Location
            </Link>
            <Link to="/history" className="text-white hover:text-gray-400">
              History
            </Link>
            <div className="relative">
              <Link to="/getuserprofile" className="text-white hover:text-gray-400 cursor-pointer"
                onMouseEnter={toggleDropdown}
                onMouseLeave={toggleDropdown}
              >
                {username}
              </Link>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
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