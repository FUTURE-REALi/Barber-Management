import React from 'react'

const StoreSetup = () => {
  return (
    <div className='h-screen w-full'>
        <div className='flex flex-col h-full w-full'>
            <nav className='flex justify-between items-center p-4 bg-[#FFF5E4] shadow-md'>
                <div>
                    PocketSalon
                </div>
                <div>
                    Logout
                </div>
            </nav>
            <div className='flex flex-col justify-between h-full w-full p-5'>
                <div className = 'flex flex-col gap-2 text-center'>
                    <h1 className='text-3xl font-bold text-gray-700'>
                        Welcome to PocketSalon
                    </h1>
                    <h2 className='text-xl font-semibold'>
                        Let's begin with setting up your store
                    </h2>
                </div>
                <div className='flex flex-col gap-2 h-[80%]'>
                    <form>
                        <div>
                            <label>Store Name</label>
                            <input type='text' placeholder='Enter your store name' />
                        </div>
                        <div>
                            <label>Owner Name</label>
                            <input type='file' />
                        </div>
                        <div>
                            <h2>Store Address</h2>
                            <div>
                                <label>Street Address</label>
                                <input type='text' placeholder='Enter your store street address' />
                            </div>
                            <div>
                                <label>City</label>
                                <input type='text' placeholder='Enter your store city' />
                            </div>
                            <div>
                                <label>State</label>
                                <input type='text' placeholder='Enter your store state' />
                            </div>
                            <div>
                                <label>Zip Code</label>
                                <input type='text' placeholder='Enter your store country' />
                            </div>
                        </div>
                        <div>
                            <label>Store Phone Number</label>
                            <input type='text' placeholder='Enter your store phone number' />
                        </div>
                        <div>
                            <label>Store Email</label>
                            <input type='text' placeholder='Enter your store email' />
                        </div>
                        <button>Save</button>
                    </form>
                </div>
            </div>
        </div>
    </div>
  )
}

export default StoreSetup