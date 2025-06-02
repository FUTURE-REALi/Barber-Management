import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { StoreDataContext } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const StoreProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate();
  const { setStoreData } = useContext(StoreDataContext); // Only use setStoreData here
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/storelogin');
      return;
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/stores/getstoreprofile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.status === 200) {
        setStoreData(response.data.store); // Always use the fresh response
        setIsLoading(false);
      }
    }).catch((error) => {
      localStorage.removeItem('token');
      navigate('/storelogin');
    })
  }, [token, setStoreData, navigate]);

  if (isloading) {
    return <div>Loading...</div>
  }
  return <>{children}</>
}

export default StoreProtectedWrapper