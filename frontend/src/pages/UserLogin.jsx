import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/UserContext'

const UserLogin = () => {
    const [email,setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigate = useNavigate()

    const {userData, setUserData} = useContext(UserDataContext)

    const submitHandler = async (e) => {
        e.preventDefault()
        const user = {
            email: email,
            password: password
        }


        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, user)

        if(response.status === 200){
            const data = response.data
            setUserData(data.user)
            localStorage.setItem('token',data.token)
            localStorage.setItem('role', 'user')
            navigate('/home')
        }

        setEmail('')
        setPassword('')
    }

return (
    <div className="h-screen w-full flex justify-center bg-[#FFF5E4] items-center">
        <div className="w-210 h-155 flex p-4 justify-center items-center bg-[#F6F8D5] rounded-3xl shadow-2xl shadow-gray-500">
            <div className='h-full w-3/5 flex justify-center items-center rounded-3xl'>
                <img src="https://avatars.mds.yandex.net/i?id=351e33e8d01f701a2ea15a49e7c361dae95a9e05-5233259-images-thumbs&n=13" alt=""
                    className='h-130 w-100 object-cover rounded-3xl shadow-lg' 
                />
            </div>
            <form 
            onSubmit={submitHandler}
            className="h-full w-2/5 py-8 pr-5">
                <div className="flex flex-col space-y-2 w-full">
                    <div className='flex flex-col items-center mb-5'>
                        <h1 className="text-3xl font-bold mb-4" >PocketSalon</h1>
                        <h2 className='text-xl font-bold font-sans'>Welcome Back</h2>
                        <h6 className='text-sm font-light text-gray-400'>Please Login to your Account</h6>
                    </div>
                    <div className="flex flex-col space-y-2 w-full mb-4">
                        <input
                            type="email"
                            id="email"
                            value = {email}
                            onChange={(e) => {
                                setEmail(e.target.value)
                            }}
                            className="px-4 py-3 bg-[#FFF5E4] rounded-lg focus:outline-none w-full focus:bg-[#FFF5E4]"
                            placeholder='Email address'
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value)
                            }}
                            className="px-4 py-3 bg-[#FFF5E4] rounded-lg focus:outline-none"
                            placeholder='Enter Password'
                        />
                    </div>
                    <h4 className='flex justify-end text-sm text-gray-400'>Forgot Password?</h4>
                    <button
                        type="submit"
                        className="text-white px-4 py-2 rounded-lg cursor-pointer mt-8 bg-[#FFA725]">
                        Login
                    </button>
                </div>
                <div className="flex items-center my-4">
                    <hr className="flex-grow border-t border-gray-300" />
                    <span className="px-3 text-gray-500 text-sm">Or Login with</span>
                    <hr className="flex-grow border-t border-gray-300" />
                </div>
                <div className="flex justify-center space-x-4">
                    <button className="w-40 px-4 py-2 rounded-lg cursor-pointer border-2 border-gray-200">
                        Google
                    </button>
                    <button className="w-40 px-4 py-2 rounded-lg cursor-pointer border-2 border-gray-200">
                        Email
                    </button>
                </div>
                <div className="flex justify-center mt-4">
                    <p className="text-sm text-gray-400">
                        Don't have an account? <Link to='/signup' className="text-[#FFA725]">Sign Up</Link>
                    </p>
                </div>
            </form>
        </div>
    </div>
)
}

export default UserLogin