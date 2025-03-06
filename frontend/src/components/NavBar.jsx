import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <div classname = "w-full bg-gray-800 p-4">
      <nav className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white text-2xl font-bold">
            PocketSalon
          </Link>
          <div className="flex space-x-4">
            <Link to="/" className="text-white hover:text-gray-400">
              Home
            </Link>
            <Link to="/area" className="text-white hover:text-gray-400">
              Location
            </Link>
            <Link to="/history" className="text-white hover:text-gray-400">
              History
            </Link>
            <Link to="/profile" className="text-white hover:text-gray-400">
              Profile
            </Link>
            <Link to="/login" className="text-white hover:text-gray-400">
              Login
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;