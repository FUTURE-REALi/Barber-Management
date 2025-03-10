import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const StoreSignUp = () => {

    const [navbarBg, setNavbarBg] = useState('bg-none');
    const [textCol, setTextCol] = useState('white');

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setNavbarBg('bg-white');
            setTextCol('white');
        } else {
            setNavbarBg('bg-none');
            setTextCol('zCoal');
        }

    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="h-full w-full flex justify-center bg-white items-center">
            <nav className={`fixed top-0 z-10 w-full ${navbarBg} flex justify-between items-center px-32 py-3 shadow-md`}>
                <div>
                    <h1 className={`text-xl font-medium leading-6 text-${textCol}`}>PocketSalon</h1>
                </div>
                <div className={`cursor-pointer text-base font-medium leading-5 text-${textCol}`}>
                    <button className="rounded-3xl border border-zCoal px-6 py-2">
                        <Link to='/login'>Login</Link>
                    </button>
                </div>
            </nav>
            <div className='flex relative w-full h-180 justify-center' style={{ backgroundImage: "url('https://sun9-78.userapi.com/impg/jNX5D4wTLEG3Q_BZFkSimDbEimc2ddoxTcpheQ/S3NKSBUz__0.jpg?size=1096x692&quality=95&sign=bba2f6e9a4632c4296ace37b958a4897&c_uniq_tag=TWBx6lq19SpMCO9D8HlKS8dhmHhnPxZL60AK7wc1GCM&type=album')" }}>
                <div className='absolute flex flex-col item-center justify-center top-40 gap-5 w-full'>
                    <div className='text-center text-white px-8'>
                        <h1 className='text-5xl font-bold'>Expand your business</h1>
                        <h1 className='text-5xl font-bold'>with PocketSalon</h1>
                    </div>
                    <div className='text-center text-white px-8'>
                        <h1 className='text-xl font-bold text-grey-400'>0% commission for 1st Month! Valid for new salon partners in select city
                        </h1>
                    </div>
                    <div className='flex justify-center gap-8 mt-10'>
                        <button className='border border-white px-8 py-2 rounded-2xl leading-6'>
                            <Link to='/registerstore'>
                                <h1 className='text-xl font-bold text-white'>Register your salon</h1>
                            </Link>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )

}

export default StoreSignUp