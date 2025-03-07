import React from 'react'

const UserLogin = () => {
return (
    <div className="h-screen w-full flex justify-center bg-blue-300 items-center">
        <div className="w-210 h-155 flex p-4 justify-center items-center bg-white rounded-3xl hadow-2xl shadow-gray-500">
            <div className='h-full w-3/5 flex justify-center items-center rounded-3xl'>
                <img src="https://th.bing.com/th/id/OIP.kL_7BYvLiSLByYB65qSH9QAAAA?w=134&h=201&c=7&r=0&o=5&dpr=1.3&pid=1.7" alt=""
                    className='h-130 w-100 object-cover rounded-3xl shadow-lg' 
                />
            </div>
            <form className="h-full w-2/5 bg-white py-8 pr-5">
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
                            name="email"
                            className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none w-full"
                            placeholder='Email address'
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="px-4 py-2 bg-gray-100 rounded-lg focus:outline-none"
                            placeholder='Enter Password'
                        />
                    </div>
                    <h4 className='flex justify-end text-sm text-gray-400'>Forgot Password?</h4>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer mt-8">
                        Login
                    </button>
                </div>
                <h4 className="flex justify-end mt-2"><a href="/register">New User? Register</a></h4>
            </form>
            
        </div>
    </div>
)
}

export default UserLogin