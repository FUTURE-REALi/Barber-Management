import React from 'react'
import NavBar from '../components/NavBar'
const HomePage = () => {
return (
    <div className="h-screen w-full bg-gray-100">
        <NavBar />
        <div className="flex-col items-center space-y-4 h-screen w-full bg-gray-100">
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
            <div>
                <h2>Your Tusted Picks</h2>
            </div>
            <div>
                Recommended
            </div>
        </div>
    </div>
)
}

export default HomePage