import React, { useContext, useState } from 'react'
import axios from 'axios';
import { useEffect } from 'react';
import { UserDataContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
const HomePage = () => {
    const [stores, setStores] = useState([]);
    const [trustedStores, setTrustedStores] = useState([]);
    const [recommendedStores, setRecommendedStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const {userData} = useContext(UserDataContext);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/getallstores`);
                if (response.status === 200) {
                    setStores(response.data);
                }
            } catch (error) {
                console.error('Error fetching stores:', error);
            }
        };
        fetchStores();
    }, []);
    


return (
    <div className="h-full w-full bg-gray-100">
        <div className="flex-col items-center space-y-4 h-full w-full bg-gray-100">
            <div className="w-full bg-gray-100 p-4">
                <form className="flex w-full py-4 justify-center">
                    <input
                        type="text"
                        placeholder="Search For Salon"
                        className="w-4/5 px-4 py-2 focus:outline-none border-gray-300 border-2 rounded-l-lg"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-r-lg">
                        Search
                    </button>
                </form>
            </div>
            {userData?.username !== '' && <div className="flex flex-col items-center space-y-4">
                <h1 className="text-2xl">Your Trusted Picks</h1>
                <div className="flex space-x-4 h-60">
                    <div>
                        <img src="/a.jpg" alt="salon" className='h-40'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div>
                        <img src="/a.jpg" alt="salon" className='h-40'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div>
                        <img src="/a.jpg" alt="salon" className='h-40'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                </div>
            </div>}
            <div className="flex flex-col items-center space-y-4">
                <h1 className="text-2xl">Recommended</h1>
                <div className="flex space-x-8 h-80">
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                    <div className = "h-full">
                        <img src="/a.jpg" alt="salon" className='h-60'/>
                        <div>
                            <h3>Salon Name</h3>
                            <p>Location</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
)
}

export default HomePage