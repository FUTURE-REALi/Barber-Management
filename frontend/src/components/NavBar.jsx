import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { User } from 'lucide-react';
const NavBar = () => {

  // const [showDropdown, setShowDropDown] = useState(false);
  // const toggleDropdown = ()=>{
  //   setShowDropDown((prev) => !prev);
  // }

  // const UserName = () => {

  //   useEffect(() => {
  //       const fetchUser = async () => {
  //           try {
  //               const token = localStorage.getItem('token');
  //               const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
  //                   headers: {
  //                       Authorization: `Bearer ${token}`,
  //                   },
  //               });
  //               setUser(response.data);
  //           } catch (error) {
  //               console.error('Error fetching user:', error.response?.data || error);
  //           }
  //       };
  //       fetchUser();
  //   }, []);
  //   return user;
  // }
  // UserName();


  return (
    <div classname = "w-full bg-[#FFA725] p-4">
      <nav className="bg-[#FFA725] p-4">
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
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;