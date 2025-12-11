import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { UserDataContext } from '../../context/UserContext';

const AddToCart = ({ qty, service, onCartChange, storeId, onCartAnim }) => {
    // Get userId from context
    const { userData } = useContext(UserDataContext);
    const userId = userData?._id;
    const token = localStorage.getItem('token');

    // Fetch old cart and sync local cart state on mount
    useEffect(() => {
        const fetchCart = async () => {
            if (!userId || !storeId) return;
            try {
                const res = await axios.get(
                    `${import.meta.env.VITE_BASE_URL}/order-cart/${userId}`,
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (res.data && Array.isArray(res.data.items)) {
                    // Replace local cart with backend cart
                    onCartChange(
                        res.data.items.map(backendItem => ({
                            ...backendItem.service,
                            qty: backendItem.quantity
                        }))
                    );
                }
            } catch (err) {
                // No cart found is fine, do nothing
            }
        };
        fetchCart();
        // eslint-disable-next-line
    }, [userId, storeId]);

    // Sync cart to backend
    const syncCartToBackend = async (updatedCart) => {
        if (!userId || !storeId) return;
        const items = updatedCart.map(item => ({
            service: item._id,
            quantity: item.qty,
        }));
        const totalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

        try {
            // Try to get existing cart
            const res = await axios.get(
                `${import.meta.env.VITE_BASE_URL}/order-cart/${userId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (res.data && res.data._id) {
                // Merge backend cart with updatedCart, updating only changed items
                let backendItems = res.data.items.map(backendItem => ({
                    service: backendItem.service._id || backendItem.service,
                    quantity: backendItem.quantity
                }));
                console.log("Backend items before merging:", backendItems);
                console.log("Items to merge:", items);
                // For each item in updatedCart, update or add in backendItems
                items.forEach(updatedItem => {
                    const idx = backendItems.findIndex(bi => bi.service === updatedItem.service);
                    if (idx !== -1) {
                        backendItems[idx].quantity = updatedItem.quantity;
                    } else {
                        backendItems.push(updatedItem);
                    }
                });
                console.log("items after merging:", items);
                console.log("Backend items before filtering:", backendItems);
                backendItems = backendItems.filter(item => item.quantity > 0);
                const newTotalPrice = backendItems.reduce((sum, item) => {
                    const local = updatedCart.find(l => l._id === item.service);
                    return sum + ((local ? local.price : 0) * item.quantity);
                }, 0);
                console.log("Updating backend cart with items:", backendItems);
                await axios.put(
                    `${import.meta.env.VITE_BASE_URL}/order-cart/update/${res.data._id}`,
                    { items: backendItems, totalPrice: newTotalPrice },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
        } catch (err) {
            // If not found, create new cart
            if (err.response && err.response.status === 404) {
                await axios.post(
                    `${import.meta.env.VITE_BASE_URL}/order-cart/create`,
                    { user: userId, store: storeId, items, totalPrice },
                    {
                        withCredentials: true,
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
            }
        }
    };

    // Local cart state logic
    const handleAdd = () => {
        onCartChange(prev => {
            const exists = prev.find(item => item._id === service._id);
            let newCart;
            if (exists) {
                newCart = prev.map(item =>
                    item._id === service._id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                newCart = [...prev, { ...service, qty: 1, storeId }];
            }
            syncCartToBackend(newCart);
            if (onCartAnim) onCartAnim();
            return newCart;
        });
    };

    // When decreasing quantity
    const handleRemove = () => {
        onCartChange(prev => {
            const exists = prev.find(item => item._id === service._id);
            if (!exists) return prev;
            let newCart;
            if (exists.qty === 1) {
                // Remove item from cart
                newCart = prev.map(item =>
                    item._id === service._id ? { ...item, qty: 0 } : item
                );
                } else {
                // Decrease quantity
                newCart = prev.map(item =>
                    item._id === service._id ? { ...item, qty: item.qty - 1 } : item
                );
            }
            console.log("New cart after remove:", newCart);
            syncCartToBackend(newCart);
            if (onCartAnim) onCartAnim();
            return newCart;
        });
    };

    const handleIncrease = () => {
        onCartChange(prev => {
            const exists = prev.find(item => item._id === service._id);
            let newCart;
            if (exists) {
                newCart = prev.map(item =>
                    item._id === service._id ? { ...item, qty: item.qty + 1 } : item
                );
            } else {
                newCart = [...prev, { ...service, qty: 1, storeId }];
            }
            syncCartToBackend(newCart);
            if (onCartAnim) onCartAnim();
            return newCart;
        });
    };

    return (
        <div>
            {qty === 0 ? (
                <button
                    className="mt-2 w-max bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition"
                    onClick={handleAdd}
                >
                    Add to Cart
                </button>
            ) : (
                <div className="flex items-center gap-2 mt-2">
                    <button
                        className="bg-gray-200 px-3 py-1 rounded text-lg font-bold"
                        onClick={handleRemove}
                        aria-label={`Remove one ${service?.service?.name || 'item'}`}
                    >
                        -
                    </button>
                    {qty > 0 && <span className="font-semibold">{qty}</span>}
                    <button
                        className="bg-gray-200 px-3 py-1 rounded text-lg font-bold"
                        onClick={handleIncrease}
                        aria-label={`Add one more ${service?.service?.name || 'item'}`}
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
};

export default AddToCart;