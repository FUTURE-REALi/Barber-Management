import React, { useContext, useState, useEffect } from 'react'
import axios from 'axios';
import { UserDataContext } from '../context/UserContext';
import { Link } from 'react-router-dom';
import SearchBox from '../components/HomePageComponents/SearchBox';

const HomePage = () => {
    const [stores, setStores] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { userData } = useContext(UserDataContext);

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async (query = '') => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/getallstores`);
            if (response.status === 200) {
                let allStores = response.data.stores;
                if (query) {
                    allStores = allStores.filter(store =>
                        store.storename.toLowerCase().includes(query.toLowerCase())
                    );
                }
                setStores(allStores);
            }
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    // Pass this to SearchBox
    const handleSearch = (e) => {
        e.preventDefault();
        fetchStores(searchQuery);
    };

    return (
        <div className="h-full w-full bg-gray-100">
            <div className="flex-col items-center space-y-4 h-full w-full bg-gray-100">
                <div className="w-full bg-gray-100 p-4">
                    <SearchBox
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        onSearch={handleSearch}
                    />
                </div>
                {userData?.username !== '' && (
                    <div className="flex flex-col items-center space-y-4">
                        <h1 className="text-2xl">Your Trusted Picks</h1>
                        <div className="flex space-x-4 h-60">
                            <div>
                                <img src="/a.jpg" alt="salon" className='h-40' />
                                <div>
                                    <h3>Salon Name</h3>
                                    <p>Location</p>
                                </div>
                            </div>
                            <div>
                                <img src="/a.jpg" alt="salon" className='h-40' />
                                <div>
                                    <h3>Salon Name</h3>
                                    <p>Location</p>
                                </div>
                            </div>
                            <div>
                                <img src="/a.jpg" alt="salon" className='h-40' />
                                <div>
                                    <h3>Salon Name</h3>
                                    <p>Location</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <div className="flex flex-col items-center space-y-4">
                    <h1 className="text-2xl">Recommended</h1>
                    <div className="flex flex-wrap gap-8 justify-center h-80 overflow-y-auto">
                        {stores.length === 0 ? (
                            <p className="text-gray-500">No salons found.</p>
                        ) : (
                            stores.map(store => (
                                <div key={store._id} className="h-full w-56 bg-white rounded-lg shadow-md flex flex-col items-center p-4">
                                    <img src={store.imageUrl || "/a.jpg"} alt={store.storename} className='h-36 w-full object-cover rounded-md mb-2' />
                                    <div className="text-center">
                                        <h3 className="font-semibold text-lg">{store.storename}</h3>
                                        <p className="text-gray-600">{store.address?.city || 'Unknown City'}</p>
                                    </div>
                                    <Link to={`/store/${store._id}/${store.storename}`} className="mt-2 text-blue-500 hover:underline text-sm">
                                        View Details
                                    </Link>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage