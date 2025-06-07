import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import CartAnimation from '../CartAnimation';
import AddToCart from './AddToCart';

const BookOnline = ({ storeId }) => {
  const [storeServices, setStoreServices] = useState([]);
  const [search, setSearch] = useState('');
  const [reviews, setReviews] = useState({});
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState([]);
  const [showAnim, setShowAnim] = useState(false);
  const rightRef = useRef(null);
  const sectionRefs = useRef([]);

  // Fetch store services from backend
  useEffect(() => {
    const fetchStoreServices = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/store-services/get-store-services/${storeId}`
        );
        if (res.data && Array.isArray(res.data)) {
          setStoreServices(res.data);

          // Group by category if available, else group all as "All Services"
          const grouped = {};
          res.data.forEach(ss => {
            const cat = ss.service?.category || 'All Services';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push(ss);
          });
          const cats = Object.keys(grouped).map(cat => ({
            name: cat,
            items: grouped[cat]
          }));
          setCategories(cats);
          setSelectedCategory(cats[0]?.name || '');
        }
      } catch (err) {
        setStoreServices([]);
        setCategories([]);
      }
    };
    if (storeId) fetchStoreServices();
  }, [storeId]);

  // Fetch reviews for each service
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/stores/${storeId}/reviews`
        );
        if (res.data && Array.isArray(res.data.ratings)) {
          // Group reviews by storeServiceId
          const reviewsObj = {};
          res.data.ratings.forEach(r => {
            if (r.service) {
              if (!reviewsObj[r.service]) reviewsObj[r.service] = [];
              reviewsObj[r.service].push(r);
            }
          });
          setReviews(reviewsObj);
        }
      } catch (err) {
        setReviews({});
      }
    };
    if (storeId) fetchReviews();
  }, [storeId, storeServices]);

  // Filtered items for each category (for search)
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(ss =>
      ss.service?.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  // When a category is clicked, scroll to its section
  const handleCategoryClick = idx => {
    setSelectedCategory(filteredCategories[idx].name);
    if (sectionRefs.current[idx]) {
      sectionRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // On scroll, update selectedCategory based on which section is at the top
  const handleScroll = () => {
    if (!rightRef.current) return;
    const scrollTop = rightRef.current.scrollTop;
    let foundIdx = 0;
    for (let i = 0; i < sectionRefs.current.length; i++) {
      const ref = sectionRefs.current[i];
      if (ref) {
        const offset = ref.offsetTop - rightRef.current.offsetTop;
        if (scrollTop >= offset - 20) {
          foundIdx = i;
        }
      }
    }
    if (filteredCategories[foundIdx] && filteredCategories[foundIdx].name !== selectedCategory) {
      setSelectedCategory(filteredCategories[foundIdx].name);
    }
  };

  // Prevent scroll-into-view when selectedCategory changes due to scroll
  const lastScrollCategory = useRef(selectedCategory);
  useEffect(() => {
    if (lastScrollCategory.current !== selectedCategory) {
      lastScrollCategory.current = selectedCategory;
      const idx = filteredCategories.findIndex(cat => cat.name === selectedCategory);
      if (idx !== -1 && sectionRefs.current[idx]) {
        sectionRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    // eslint-disable-next-line
  }, [selectedCategory]);

  // Add to cart logic
  const triggerAnim = () => {
    setShowAnim(false);
    setTimeout(() => setShowAnim(true), 10);
  };

  const handleAddToCart = (ss) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === ss._id);
      if (exists) {
        return prev.map(item =>
          item._id === ss._id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...ss, qty: 1 }];
    });
    triggerAnim();
  };

  const handleQtyChange = (ss, delta) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === ss._id);
      if (!exists && delta > 0) {
        return [...prev, { ...ss, qty: 1 }];
      }
      // Remove item if qty would go to 0
      return prev
        .map(item =>
          item._id === ss._id
            ? { ...item, qty: Math.max(0, item.qty + delta) }
            : item
        )
        .filter(item => item.qty > 0);
    });
    triggerAnim();
  };

  const getCartQty = (ss) => {
    const found = cart.find(item => item._id === ss._id);
    return found ? found.qty : 0;
  };

  return (
    <div className="flex w-full h-[70vh] bg-white rounded shadow overflow-hidden">
      {/* Left: Categories */}
      <div
        className="w-1/4 min-w-[220px] border-r bg-gray-50 h-full overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <ul className="py-4">
          {filteredCategories.map((cat, idx) => (
            <li
              key={cat.name}
              className={`px-6 py-2 cursor-pointer text-lg transition-all duration-200 ${
                selectedCategory === cat.name
                  ? 'text-red-500 font-bold border-l-4 border-red-400 bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => handleCategoryClick(idx)}
            >
              {cat.name} <span className="text-gray-400 text-base">({cat.items.length})</span>
            </li>
          ))}
        </ul>
        <style>
          {`
            .w-1\\/4::-webkit-scrollbar { display: none; }
          `}
        </style>
      </div>
      {/* Right: All Items, all categories stacked */}
      <div
        ref={rightRef}
        className="flex-1 h-full overflow-y-auto px-10 py-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          scrollBehavior: 'smooth'
        }}
        onScroll={handleScroll}
      >
        {/* Top bar with search */}
        <div className="sticky top-0 bg-white flex items-center gap-4 mb-2 justify-between border-b border-gray-200" style={{boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)'}}>
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Order Online</h2>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <span className="material-icons text-base">schedule</span>
              36 min
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <span className="material-icons text-base">track_changes</span>
              Live track your order
            </span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search within menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-red-200"
            />
          </div>
        </div>
        <div className="flex flex-col gap-6">
          {filteredCategories.map((cat, idx) => (
            <div
              key={cat.name}
              ref={el => (sectionRefs.current[idx] = el)}
              className="mb-2 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mt-6 mb-4">{cat.name}</h3>
              {cat.items.length === 0 ? (
                <span className="text-gray-400">No items found.</span>
              ) : (
                cat.items.map((ss, i) => {
                  const qty = getCartQty(ss);
                  return (
                    <div key={ss._id} className="flex flex-col gap-1 border-b pb-4">
                      <div className="flex items-center gap-2">
                        <span className="border border-green-500 text-green-600 rounded w-5 h-5 flex items-center justify-center text-xs font-bold">🟩</span>
                        <span className="text-lg font-semibold">{ss.service?.name}</span>
                      </div>
                      <span className="text-gray-700 font-medium">₹{ss.price}</span>
                      <span className="text-gray-500 text-sm">{ss.service?.description}</span>
                      <span className="text-gray-500 text-sm">Duration: {ss.duration} min</span>
                      {/* Use AddToCart component and pass setCart and storeId */}
                      <AddToCart
                        qty={qty}
                        service={ss}
                        storeId={storeId}
                        onCartChange={setCart}
                        onCartAnim={triggerAnim}
                      />
                      {/* Reviews */}
                      <div className="mt-2">
                        <span className="font-semibold text-gray-700">Reviews:</span>
                        {reviews[ss.service?._id] && reviews[ss.service?._id].length > 0 ? (
                          <ul className="ml-4 mt-1">
                            {reviews[ss.service._id].map((review, i) => (
                              <li key={review._id || i} className="text-gray-600 text-sm mb-1">
                                <span className="font-semibold">{review.user?.name || 'User'}:</span> {review.reviewText} <span className="text-yellow-600">({review.rating}★)</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span className="text-gray-400 ml-2">No reviews yet.</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          ))}
        </div>
        <style>
          {`
            .flex-1::-webkit-scrollbar { display: none; }
          `}
        </style>
      </div>
      {/* Cart Animation */}
      <CartAnimation show={showAnim} cartCount={cart.reduce((a, b) => a + b.qty, 0)} />
    </div>
  );
};

export default BookOnline;