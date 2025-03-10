import React, {useEffect, useState } from 'react'
import { Link, useNavigate} from 'react-router-dom'
import { CircleCheckBig, HandCoins, Headset, Users } from 'lucide-react'
const StoreLandingPage = () => {

    const [navbarBg, setNavbarBg] = useState('bg-none');
    const [textCol, setTextCol] = useState('black');
    const navigate = useNavigate();

    const handleScroll = () => {
        if (window.scrollY > 0) {
            setNavbarBg('bg-white');
            setTextCol('z-coal');
        } else {
            setNavbarBg('bg-none');
            setTextCol('black');
        }

    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    });

    return (
        <div className="h-full w-full flex flex-col justify-center bg-white items-center">
            <nav className={`fixed top-0 z-10 w-full ${navbarBg} flex justify-between items-center px-32 py-3 shadow-md `}>
                <div>
                    <h1 className={`text-xl font-medium leading-6 ${textCol}`}>PocketSalon</h1>
                </div>
                <div className={`cursor-pointer text-base font-medium leading-5 ${textCol}`}>
                    <button className="rounded-3xl border border-zCoal px-6 py-2"
                        onClick={() => navigate('/storelogin')}>
                        Login
                    </button>
                </div>
            </nav>
            <div className='flex relative w-full h-180 justify-center' 
                style={{ backgroundImage: "url('/background4.jpg')" }}>
                <div className='absolute flex flex-col item-center justify-center top-40 gap-5 w-full'>
                    <div className='text-center text-black px-8'>
                        <h1 className='text-5xl font-bold'>Expand your business</h1>
                        <h1 className='text-5xl font-bold'>with PocketSalon</h1>
                    </div>
                    <div className='text-center px-8'>
                        <h1 className='text-xl font-bold text-black'>0% commission for 1st Month! Valid for new salon partners in select city
                        </h1>
                    </div>
                    <div className='flex justify-center gap-8 mt-10 curson-pointer'>
                        <button className='border border-zCoal px-8 py-2 rounded-2xl leading-6 cursor-pointer w-80 text-xl font-semibold'
                            onClick={() => navigate('/registerstore')}>
                            Register your Salon
                        </button>
                    </div>
                </div>
            </div>
            <section className='flex flex-col items-center w-full px-32 py-10'>
                <div className='flex items-center w-full px-32 py-10'>
                    <hr className='flex-grow border-t-4 border-gray-200'/>
                    <h1 className='text-4xl leading-6 font-bold'>Why to become partner of PocketSalon?</h1>
                    <hr className='flex-grow border-t-4 border-gray-200'/>
                </div>
                <div className='flex justify-between w-full gap-6 px-32 py-10 '>
                    <div className='flex flex-col items-center text-center w-60 px-4'>
                        <Headset size={48} />
                        <h1 className='text-2xl font-bold text-gray-500 mt-4'>Fast Customer Support</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Nunc auctor, magna nec ultricies tincidunt, mi nisl tincidunt 
                            nunc, nec sollicitudin nunc ex sed nisl.
                        </p>
                    </div>
                    <div className='flex flex-col items-center text-center w-60 px-4'>
                        <Users size={48}/>
                        <h1 className='text-2xl font-bold text-gray-500 mt-4'>Attracts new Customer</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Nunc auctor, magna nec ultricies tincidunt, mi nisl tincidunt 
                            nunc, nec sollicitudin nunc ex sed nisl.
                        </p>
                    </div>
                    <div className='flex flex-col items-center text-center w-60 px-4'>
                        <HandCoins size={48} />
                        <h1 className='text-2xl font-bold text-gray-500 mt-4'>Effective Working Hours</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                            Nunc auctor, magna nec ultricies tincidunt, mi nisl tincidunt 
                            nunc, nec sollicitudin nunc ex sed nisl.
                        </p>
                    </div>

                </div>
            </section>
            <div className='flex flex-col items-center px-32 py-10 w-300 border border-gray-400 rounded-2xl'>
                <h1 className='text-4xl font-bold leading-6 mb-5'>Ready to take your Salon online in 10 minutes?</h1>
                <h2 className='text-xl font-sm leading-6 text-gray-800 mb-5'>Please make this documents and details ready for fast and smooth registration</h2>

                <div className='flex-col gap-4 grid grid-cols-2 py-4 px-8 w-2/3'>
                    <div className='flex'><CircleCheckBig /><h2>Salon Details</h2></div>
                    <div className='flex'><CircleCheckBig /><h2>PAN Card</h2></div>
                    <div className='flex'><CircleCheckBig /><h2>Price Brochure</h2></div>
                    <div className='flex'><CircleCheckBig /><h2>Bank Account Details</h2></div>
                    <div className='flex'><CircleCheckBig /><h2>GST Number, if applicable</h2></div>
                </div>

                <div className='flex flex-col justify-center items-center mt-4 gap-6'>
                    <h1 className='text-2xl font-semibold'>Click on button below for taking your salon online..</h1>
                    <button className='w-80 border border-zCoal px-8 py-2 rounded-2xl leading-6 cursor-pointer'
                        onClick={() => navigate('/registerstore')}>
                        Register your Salon
                    </button>
                </div>
            </div>
        </div>
    )

}

export default StoreLandingPage