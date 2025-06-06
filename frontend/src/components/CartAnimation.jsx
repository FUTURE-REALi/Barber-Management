import React, { useEffect, useState } from 'react';

const CartAnimation = ({ show, cartCount }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-white shadow-lg rounded-full border border-gray-200 animate-bounce"
      style={{ minWidth: 200 }}
    >
      <span className="text-green-600 text-2xl">🛒</span>
      <span className="font-semibold text-gray-800">
        Cart updated! {cartCount} item{cartCount !== 1 ? 's' : ''}
      </span>
    </div>
  );
};

export default CartAnimation;