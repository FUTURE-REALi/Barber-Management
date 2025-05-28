import React from 'react'

const ProfileInfo = () => {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="text-gray-700">
                <p>This is where your profile information will be displayed.</p>
                {/* Example profile information */}
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <div className="font-bold">John Doe</div>
                    <div className="text-sm text-gray-500">Email: xyz@gmail.com</div>
                    <div className="mt-2">Bio: A brief description about yourself.</div>
                    <div className="mt-2">Location: City, Country</div>
                    <div className="mt-2">Joined: January 1, 2020</div>
                </div>
            </div>
        </div>

    )
}

export default ProfileInfo