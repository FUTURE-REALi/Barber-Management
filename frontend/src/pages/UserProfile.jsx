import React, { useContext, useEffect, useState } from 'react';
import { UserDataContext } from '../context/UserContext';
import { useNavigate, useParams } from 'react-router-dom';

import ReviewsSection from '../components/UserProfileComponents/ActivityComponents/ReviewsSection';
import RatingsSection from '../components/UserProfileComponents/ActivityComponents/RatingsSection';
import CommentsSection from '../components/UserProfileComponents/ActivityComponents/CommentsSection';
import FavouriteSalon from '../components/UserProfileComponents/ActivityComponents/FavouriteSalon';
import UpcomingBookings from '../components/UserProfileComponents/BookingComponents/UpcomingBookings';
import PastBookings from '../components/UserProfileComponents/BookingComponents/PastBookings';
import CancelledBookings from '../components/UserProfileComponents/BookingComponents/CancelledBookings';
import PaymentMethods from '../components/UserProfileComponents/PaymentComponents/PaymentMethods';
import TransactionHistory from '../components/UserProfileComponents/PaymentComponents/TransactionHistory';
import Invoices from '../components/UserProfileComponents/PaymentComponents/Invoices';
import ProfileInfo from '../components/UserProfileComponents/ProfileSettingsComponents/ProfileInfo';
import ChangePassword from '../components/UserProfileComponents/ProfileSettingsComponents/ChangePassword';
import Notifications from '../components/UserProfileComponents/ProfileSettingsComponents/Notifications';

const menuItems = [
  { label: 'Activity', dropdown: ['Reviews', 'Ratings', 'Comments', 'Favourite Salon'] },
  { label: 'Online Bookings', dropdown: ['Upcoming', 'Past', 'Cancelled'] },
  { label: 'Payment', dropdown: ['Payment Methods', 'Transaction History', 'Invoices'] },
  { label: 'Account Settings', dropdown: ['Profile Info', 'Change Password', 'Notifications'] },
];
const UserProfile = () => {
  const [pinnedIndices, setPinnedIndices] = useState([]);
  const [hoveredIndices, setHoveredIndices] = useState([]);
  const [username, setUsername] = useState('John Doe');
  const { userData } = useContext(UserDataContext);
  const navigate = useNavigate();
  const { menu, option } = useParams();

  useEffect(() => {
    if (userData && userData.username) {
      setUsername(userData.username);
    }
  }, [userData]);

  const handleDropdownClick = (idx) => {
    setPinnedIndices((prev) =>
      prev.includes(idx)
        ? prev.filter((item) => item !== idx)
        : [...prev, idx]
    );
  };

  const handleMouseEnter = (idx) => {
    setHoveredIndices((prev) => [...new Set([...prev, idx])]);
  };

  const handleMouseLeave = (idx) => {
    setHoveredIndices((prev) => prev.filter((item) => item !== idx));
  };

  // Derive selectedMenu and selectedOption from URL params
  const selectedMenu = menu
    ? menuItems.findIndex(
        (item) => item.label.toLowerCase().replace(/\s+/g, '') === menu
      )
    : null;
  const selectedOption =
    selectedMenu !== null && option
      ? menuItems[selectedMenu].dropdown.find(
          (opt) => opt.toLowerCase().replace(/\s+/g, '') === option
        )
      : null;

  // Navigate to a path like "/getuserprofile/activity/reviews"
  const handleOptionClick = (menuIdx, option) => {
    const basePath = '/getuserprofile';
    const labelPath = menuItems[menuIdx].label.toLowerCase().replace(/\s+/g, '');
    const optionPath = option.toLowerCase().replace(/\s+/g, '');
    navigate(`${basePath}/${labelPath}/${optionPath}`);
  };

  // Basic right content
  const renderRightContent = () => {
    if (selectedMenu === null || selectedOption === null) {
      return (
        <div className="text-gray-500 text-lg flex items-center justify-center h-full">
          Please select an option from the left menu.
        </div>
      );
    }
    if (selectedMenu === 0 && selectedOption === 'Reviews') {
      return <ReviewsSection />;
    }
    if (selectedMenu === 0 && selectedOption === 'Ratings') {
      return <RatingsSection />;
    }
    if (selectedMenu === 0 && selectedOption === 'Comments') {
      return <CommentsSection />;
    }
    if (selectedMenu === 0 && selectedOption === 'Favourite Salon') {
      return <FavouriteSalon />;
    }
    if (selectedMenu === 1){
      if (selectedOption === 'Upcoming') {
        return <UpcomingBookings />;
      }
      if (selectedOption === 'Past') {
        return <PastBookings />;
      }
      if (selectedOption === 'Cancelled') {
        return <CancelledBookings />;
      }
    }
    if (selectedMenu === 2) {
      if (selectedOption === 'Payment Methods') {
        return <PaymentMethods />;
      }
      if (selectedOption === 'Transaction History') {
        return <TransactionHistory />;
      }
      if (selectedOption === 'Invoices') {
        return <Invoices />;
      }
    }
    if (selectedMenu === 3) {
      if (selectedOption === 'Profile Info') {
        return <ProfileInfo />;
      }
      if (selectedOption === 'Change Password') {
        return <ChangePassword />;
      }
      if (selectedOption === 'Notifications') {
        return <Notifications />;
      }
    }
    
    return (
      <div>
        <h2 className="text-2xl font-semibold mb-4">
          {menuItems[selectedMenu].label} - {selectedOption}
        </h2>
        <div className="text-gray-700">
          <p>
            This is the <span className="font-bold">{selectedOption}</span> section of{' '}
            <span className="font-bold">{menuItems[selectedMenu].label}</span>.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className='flex flex-col items-center justify-center h-screen bg-gray-100'>
      <div className='bg-white p-6 rounded-lg shadow-md h-full w-280 flex-col justify-between'>
        <div>
          <h1 className='text-2xl font-bold mb-4'>Hey {username},</h1>
          <div className='flex flex-col items-center'>
            <div>background image</div>
          </div>
        </div>
        <div className='flex items-start mt-4 gap-5 h-150'>
          {/* Left Menu */}
          <div className='w-1/3'>
            {menuItems.map((item, idx) => {
              const isOpen = pinnedIndices.includes(idx) || hoveredIndices.includes(idx);
              return (
                <div
                  key={item.label}
                  className='flex flex-col mb-4 border-2 border-gray-300 p-4 rounded-2xl relative'
                  onMouseEnter={() => handleMouseEnter(idx)}
                  onMouseLeave={() => handleMouseLeave(idx)}
                  onClick={() => handleDropdownClick(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='border-b-2 border-gray-300 pb-4 w-full'>
                    <h2 className='text-xl text-gray-800 hover:text-gray-600'>{item.label}</h2>
                  </div>
                  {isOpen && (
                    <div className='mt-2'>
                      {item.dropdown.map((option) => (
                        <div
                          key={option}
                          className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                            selectedMenu === idx && selectedOption === option ? 'bg-gray-200 font-semibold' : ''
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOptionClick(idx, option);
                          }}
                        >
                          <h3 className='text-md text-gray-600'>{option}</h3>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {/* Right Content */}
          <div className='w-2/3 border-l-2 border-gray-200 pl-5'>
            {renderRightContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;