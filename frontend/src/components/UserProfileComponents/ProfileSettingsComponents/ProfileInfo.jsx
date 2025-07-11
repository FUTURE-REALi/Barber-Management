import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserDataContext } from '../../../context/UserContext';

const emptyAddress = { building: '', street: '', city: '', state: '' };

const ProfileInfo = () => {
    const { userData, setUserData } = useContext(UserDataContext);
    const [addresses, setAddresses] = useState(userData?.address || []);
    const [editingIndex, setEditingIndex] = useState(null);
    const [newAddress, setNewAddress] = useState(emptyAddress);
    const [loading, setLoading] = useState(false);
    const [editMode, setEditMode] = useState(false);

    // Save all addresses (replace with new array)
    const handleSave = async () => {
        setLoading(true);
        try {
            await axios.put(
                `${import.meta.env.VITE_BASE_URL}/users/update-location/${userData._id}`,
                { locations: addresses },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            setEditingIndex(null);
            setNewAddress(emptyAddress);
            setUserData({ ...userData, address: addresses });
            setEditMode(false);
        } catch {
            alert("Failed to update address");
        }
        setLoading(false);
    };

    // Edit address at index
    const handleEdit = idx => {
        setEditingIndex(idx);
        setNewAddress(addresses[idx] || emptyAddress);
    };

    // Update address at index
    const handleUpdate = idx => {
        const updated = [...addresses];
        updated[idx] = { ...newAddress };
        setAddresses(updated);
        setEditingIndex(null);
        setNewAddress(emptyAddress);
    };

    // Add new address
    const handleAdd = () => {
        setAddresses([...addresses, { ...newAddress }]);
        setNewAddress(emptyAddress);
        setEditingIndex(null);
    };

    // Remove address
    const handleRemove = idx => {
        setAddresses(addresses.filter((_, i) => i !== idx));
    };

    // Handle input change for address fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAddress(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
            <div className="text-gray-700">
                <div className="mt-4 p-4 border rounded bg-gray-50">
                    <div className="font-bold">{userData?.name || "John Doe"}</div>
                    <div className="text-sm text-gray-500">Email: {userData?.email || "xyz@gmail.com"}</div>
                    <div className="mt-2">Bio: {userData?.bio || "A brief description about yourself."}</div>
                    <div className="mt-2">
                        <span className="font-semibold">Addresses:</span>
                        <ul className="mt-2">
                            {addresses.length === 0 && <li className="text-gray-400">No addresses added.</li>}
                            {addresses.map((addr, idx) => (
                                <li key={idx} className="flex flex-col sm:flex-row items-start sm:items-center mb-2">
                                    {editingIndex === idx ? (
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <input
                                                className="border px-2 py-1 rounded"
                                                name="building"
                                                value={newAddress.building}
                                                onChange={handleInputChange}
                                                placeholder="Building"
                                                disabled={!editMode}
                                            />
                                            <input
                                                className="border px-2 py-1 rounded"
                                                name="street"
                                                value={newAddress.street}
                                                onChange={handleInputChange}
                                                placeholder="Street"
                                                disabled={!editMode}
                                            />
                                            <input
                                                className="border px-2 py-1 rounded"
                                                name="city"
                                                value={newAddress.city}
                                                onChange={handleInputChange}
                                                placeholder="City"
                                                disabled={!editMode}
                                            />
                                            <input
                                                className="border px-2 py-1 rounded"
                                                name="state"
                                                value={newAddress.state}
                                                onChange={handleInputChange}
                                                placeholder="State"
                                                disabled={!editMode}
                                            />
                                            <button
                                                className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
                                                onClick={() => handleUpdate(idx)}
                                                disabled={loading || !editMode}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="ml-2 px-3 py-1 bg-gray-300 rounded"
                                                onClick={() => setEditingIndex(null)}
                                                disabled={loading || !editMode}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 items-center">
                                            <span className="ml-2">
                                                {addr.building}, {addr.street}, {addr.city}, {addr.state}
                                            </span>
                                            {editMode && (
                                                <>
                                                    <button
                                                        className="ml-4 px-3 py-1 bg-orange-500 text-white rounded"
                                                        onClick={() => handleEdit(idx)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="ml-2 px-3 py-1 bg-red-500 text-white rounded"
                                                        onClick={() => handleRemove(idx)}
                                                    >
                                                        Remove
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                        {/* Add new address */}
                        {editMode && editingIndex === null && (
                            <div className="flex flex-wrap gap-2 items-center mt-2">
                                <input
                                    className="border px-2 py-1 rounded"
                                    name="building"
                                    value={newAddress.building}
                                    onChange={handleInputChange}
                                    placeholder="Building"
                                />
                                <input
                                    className="border px-2 py-1 rounded"
                                    name="street"
                                    value={newAddress.street}
                                    onChange={handleInputChange}
                                    placeholder="Street"
                                />
                                <input
                                    className="border px-2 py-1 rounded"
                                    name="city"
                                    value={newAddress.city}
                                    onChange={handleInputChange}
                                    placeholder="City"
                                />
                                <input
                                    className="border px-2 py-1 rounded"
                                    name="state"
                                    value={newAddress.state}
                                    onChange={handleInputChange}
                                    placeholder="State"
                                />
                                <button
                                    className="ml-2 px-3 py-1 bg-green-600 text-white rounded"
                                    onClick={handleAdd}
                                    disabled={
                                        !newAddress.building &&
                                        !newAddress.street &&
                                        !newAddress.city &&
                                        !newAddress.state
                                    }
                                >
                                    Add
                                </button>
                            </div>
                        )}
                        {/* Show Update or Save All button */}
                        {!editMode ? (
                            <button
                                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded"
                                onClick={() => setEditMode(true)}
                            >
                                Update
                            </button>
                        ) : (
                            <div className="flex gap-2 mt-4">
                                <button
                                    className="px-4 py-2 bg-blue-700 text-white rounded"
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : "Save All"}
                                </button>
                                <button
                                    className="px-4 py-2 bg-gray-400 text-white rounded"
                                    onClick={() => {
                                        setEditMode(false);
                                        setEditingIndex(null);
                                        setNewAddress(emptyAddress);
                                        setAddresses(userData?.address || []);
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="mt-2">Joined: {userData?.joined || "January 1, 2020"}</div>
                </div>
            </div>
        </div>
    );
};

export default ProfileInfo;