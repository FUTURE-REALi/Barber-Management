import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBox = ({ searchQuery, setSearchQuery, onSearch }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchQuery) {
        setSuggestions([]);
        return;
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/getallstores`);
        if (response.status === 200 && Array.isArray(response.data.stores)) {
          const filtered = response.data.stores.filter(store =>
            store.storename.toLowerCase().includes(searchQuery.toLowerCase())
          );
          setSuggestions(filtered.slice(0, 5));
        }
      } catch (error) {
        setSuggestions([]);
      }
    };
    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setShowDropdown(true);
  };

  const handleSuggestionClick = (storename) => {
    setSearchQuery(storename);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full flex justify-center" ref={dropdownRef}>
      <form className="flex w-4/5 py-4" onSubmit={onSearch} autoComplete="off">
        <input
          type="text"
          placeholder="Search For Salon"
          value={searchQuery}
          onChange={handleInputChange}
          className="w-full px-4 py-2 focus:outline-none border-gray-300 border-2 rounded-l-lg"
          onFocus={() => searchQuery && setShowDropdown(true)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
        >
          Search
        </button>
      </form>
      {showDropdown && suggestions.length > 0 && (
        <ul className="absolute z-10 left-1/2 -translate-x-1/2 mt-16 w-4/5 bg-white border border-gray-200 rounded-b-lg shadow-lg max-h-56 overflow-y-auto">
          {suggestions.map(store => (
            <li
              key={store._id}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
              onClick={() => handleSuggestionClick(store.storename)}
            >
              {store.storename}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;