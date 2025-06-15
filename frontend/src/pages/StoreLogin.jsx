import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { StoreDataContext } from '../context/StoreContext';

const StoreLogin = () => {
  const gridSize = 3;
  const imageSize = 650;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { storeData, setStoreData } = useContext(StoreDataContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newStore = {
      email: email,
      password: password,
    };

    console.log(newStore);

    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/stores/login`, newStore);

    if(response.status === 200){
      const data = response.data;
      const newdata = {
        email: data.store.email,
        storename: data.store.storename,
        ownername: data.store.ownername,
        address: data.store.address,
        phone: data.store.phone,
        id: data.store._id,
        services: data.store.services || [],
      }
      setStoreData(newdata);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', 'store');
      console.log(data);
      navigate('/storehomepage');
    }
    else{
      alert('Store already exists');
    }

    setEmail('');
    setPassword('');
  }
  
  return (
    <div className='flex items-center justify-center h-screen w-full bg-black'>
      <div className='flex min-w-[1000px] h-[700px] justify-center rounded-3xl overflow-hidden gap-x-5'>
        <div className='flex flex-col w-[35%] h-full justify-between p-8 rounded-3xl border border-gray-200 
                        shadow-md backdrop-blur-lg bg-white/10'>
          <div className='text-center w-full'>
            <h1 className='text-white font-bold text-3xl'>Welcome Back</h1>
            <h2 className='text-gray-300 font-semibold text-sm'>Fill the details below to login</h2>
          </div>
          <div className='flex flex-col h-full justify-center'>
            <form className='flex flex-col gap-3'
              onSubmit={(e) => {
                handleSubmit(e);
              }}
            >
              <input type='email' placeholder='Enter email address' className='border border-gray-700 rounded-lg px-4 py-2 w-full bg-transparent text-white placeholder-gray-400'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input type='password' placeholder='Enter Password' className='border border-gray-700 rounded-lg px-4 py-2 w-full bg-transparent text-white placeholder-gray-400'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button className='bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600'>Login Now</button>
            </form>
            <div className='flex mt-2 justify-end'>
              <p className='text-gray-300 text-sm leading-6'>New Here?<Link to='/registerstore' className='text-blue-200'>Register Now</Link></p>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-3 grid-rows-3 gap-y-2 gap-x-2 w-[60%] h-full relative overflow-hidden mt-2'>
          {[...Array(gridSize * gridSize)].map((_, index) => {
            const row = Math.floor(index / gridSize);
            const col = index % gridSize;
            return (
              <div
                key={index}
                className="bg-cover bg-no-repeat rounded-xl"
                style={{
                  backgroundImage: "url('https://wallpaperaccess.com/full/2090229.jpg')",
                  backgroundSize: `${imageSize}px ${imageSize}px`,
                  backgroundPosition: `-${col * (imageSize / gridSize)}px -${row * (imageSize / gridSize)}px`,
                  width: `${imageSize / gridSize}px`,
                  height: `${imageSize / gridSize}px`,
                }}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StoreLogin;
