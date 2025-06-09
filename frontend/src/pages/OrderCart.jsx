import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import CartAnimation from '../components/CartAnimation';
import { UserDataContext } from '../context/UserContext';

const OrderCart = () => {
  const { userData } = useContext(UserDataContext);
  const userId = userData?._id;
  const token = localStorage.getItem('token');
  const [cart, setCart] = useState([]);
  const [showAnim, setShowAnim] = useState(false);

  // Fetch cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      if (!userId) return;
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/order-cart/${userId}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        if (res.data && Array.isArray(res.data.items)) {
          setCart(
            res.data.items.map(backendItem => ({
              ...backendItem.service,
              qty: backendItem.quantity,
              serviceName: backendItem.service?.name || backendItem.service?.service?.name
            }))
          );
        }
      } catch (err) {
        setCart([]);
      }
    };
    fetchCart();
  }, [userId, token]);

  // Helper to always retrigger animation
  const triggerAnim = () => {
    setShowAnim(false);
    setTimeout(() => setShowAnim(true), 10);
  };

  // Sync cart to backend
  const syncCartToBackend = async (updatedCart) => {
    if (!userId) return;
    const items = updatedCart.map(item => ({
      service: item._id,
      quantity: item.qty,
    }));
    const totalPrice = updatedCart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    try {
      // Get cart id
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/order-cart/${userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      if (res.data && res.data._id) {
        await axios.put(
          `${import.meta.env.VITE_BASE_URL}/order-cart/update/${res.data._id}`,
          { items, totalPrice },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
    } catch (err) {
      // If not found, create new cart
      if (err.response && err.response.status === 404) {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/order-cart/create`,
          { user: userId, items, totalPrice },
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
          }
        );
      }
    }
  };
  // Quantity change handler
  const handleQtyChange = (idx, delta) => {
    setCart(prev => {
      const updated = prev
        .map((item, i) =>
          i === idx ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        );
      syncCartToBackend(updated);
      return updated;
    });
    triggerAnim();
  };

  // Remove handler
  const handleRemove = idx => {
    setCart(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      syncCartToBackend(updated);
      return updated;
    });
    triggerAnim();
  };

  const merchandise = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = cart.length > 0 ? 16.95 : 0;
  const discount = cart.length > 0 ? -16.95 : 0;
  const tax = cart.length > 0 ? 10.63 : 0;
  const total = merchandise + shipping + discount + tax;

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-start min-h-screen bg-gray-100 py-8 px-2">
        {/* Cart Items */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mb-8 md:mb-0 md:mr-8">
          <h1 className="text-2xl font-bold mb-4">Cart: ({cart.length} item{cart.length !== 1 ? 's' : ''})</h1>
          {cart.length === 0 ? (
            <p className="text-gray-600 text-center mb-6">Your cart is currently empty.</p>
          ) : (
            cart.map((item, idx) => (
              <div key={item._id} className="flex flex-col md:flex-row items-center border-b py-4">
                {item.img ? (
                  <img
                    src={item.img || 'https://via.placeholder.com/112'}
                    alt={item.serviceName || item.name}
                    className="w-28 h-28 object-cover rounded mb-4 md:mb-0 md:mr-6"
                  />
                ) : null}
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">
                      {item.serviceName || item.name}
                    </span>
                    <button
                      className="text-gray-400 hover:text-red-500 text-xl"
                      onClick={() => handleRemove(idx)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                  <div className="text-gray-500 text-sm mb-2">{item.desc || item.description}</div>
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      className="px-2 py-1 border rounded text-lg"
                      onClick={() => handleQtyChange(idx, -1)}
                      disabled={item.qty === 1}
                    >-</button>
                    <span className="px-2">{item.qty}</span>
                    <button
                      className="px-2 py-1 border rounded text-lg"
                      onClick={() => handleQtyChange(idx, 1)}
                    >+</button>
                    <span className="ml-4 font-semibold">${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                  <div className="text-gray-600 text-sm">
                    <span className="font-semibold">Ship Only</span>
                    {item.shipping && <> · {item.shipping}</>}
                    {item.shippingTime && <> · {item.shippingTime}</>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {/* Cart Summary */}
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
          <h2 className="text-xl font-bold mb-4">Cart Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Merchandise:</span>
            <span>${merchandise.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Est. Shipping & Handling:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Shipping Discount:</span>
            <span className="text-green-600">${discount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Est. Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t my-2"></div>
          <div className="flex justify-between font-bold text-lg mb-4">
            <span>Est. Order Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Apply a Promotion Code"
              className="border px-2 py-1 rounded w-2/3 mr-2"
            />
            <button className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300">APPLY</button>
          </div>
          <button className="w-full bg-black text-white py-2 rounded font-semibold mb-2 hover:bg-gray-900">
            CHECKOUT NOW
          </button>
          <button className="w-full bg-yellow-400 text-black py-2 rounded font-semibold hover:bg-yellow-500 flex items-center justify-center gap-2">
            <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="w-6 h-6" />
            PayPal
          </button>
          <div className="text-xs text-gray-500 mt-2 text-center">
            By continuing to Checkout, you are agreeing to our Terms of Use and Privacy Policy.
          </div>
        </div>
      </div>
      <CartAnimation show={showAnim} cartCount={cart.length} />
    </>
  );
};

export default OrderCart;