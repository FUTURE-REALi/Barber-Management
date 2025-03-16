import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { StoreDataContext } from '../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const StoreProtectedWrapper = ({ children }) => {
  const token = localStorage.getItem('token')
  const navigate = useNavigate();
  const { storeData, setStoreData } = useContext(StoreDataContext);
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/storelogin');
    }

    axios.get(`${import.meta.env.VITE_BASE_URL}/stores/get-store`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).then((response) => {
      if (response.status === 200) {
        setStoreData(response.data);
        setIsLoading(false);
      }
    }).catch((error) => {
      localStorage.removeItem('token');
      console.log(error);
      navigate('/storelogin');
    })
  }
    , [token])

  if (isloading) {
    return <div>Loading...</div>
  }
  else {
    return (
      <>
        {children}
      </>
    )
  }
}

export default StoreProtectedWrapper