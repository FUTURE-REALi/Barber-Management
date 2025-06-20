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
      // Add storeId here!
      return [...prev, { ...ss, qty: 1, storeId }];
    });
    triggerAnim();
  };

  const handleQtyChange = (ss, delta) => {
    setCart(prev => {
      const exists = prev.find(item => item._id === ss._id);
      if (!exists && delta > 0) {
        // Add storeId here!
        return [...prev, { ...ss, qty: 1, storeId }];
      }
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

  // Helper to calculate discounted price
  const getDiscountedPrice = (ss) => {
    if (ss.discount && ss.discount > 0) {
      return Math.round(ss.price * (1 - ss.discount / 100));
    }
    return ss.price;
  };

  // Helper for description truncation
  const getShortDescription = (desc, max = 80) => {
    if (!desc) return "";
    return desc.length > max ? desc.slice(0, max) + "..." : desc;
  };

  return (
    <div className="flex w-full bg-white rounded shadow overflow-hidden" style={{ height: "80vh", minHeight: 480 }}>
      {/* Left: Categories */}
      <div
        className="w-72 min-w-[220px] border-r bg-white h-full overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          height: "100%",
        }}
      >
        <ul className="py-4">
          {filteredCategories.map((cat, idx) => (
            <li
              key={cat.name}
              className={`px-6 py-2 cursor-pointer text-lg transition-all duration-200 flex items-center justify-between
                ${selectedCategory === cat.name
                  ? 'text-red-500 font-bold border-l-4 border-red-400 bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
                }`}
              onClick={() => handleCategoryClick(idx)}
            >
              <span>{cat.name}</span>
              <span className={`ml-2 text-base font-semibold ${selectedCategory === cat.name ? "text-red-400" : "text-gray-400"}`}>
                ({cat.items.length})
              </span>
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
          scrollBehavior: 'smooth',
          height: "100%",
        }}
        onScroll={handleScroll}
      >
        {/* Top bar with search */}
        <div className="sticky top-0 bg-white flex items-center gap-4 mb-2 justify-between border-b border-gray-200 z-10" style={{boxShadow: '0 2px 8px 0 rgba(0,0,0,0.03)'}}>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-800">Order Online</h2>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <span className="material-icons text-base">track_changes</span>
              Live track your order
            </span>
            <span className="text-gray-400 text-sm flex items-center gap-1">
              <span className="material-icons text-base">schedule</span>
              24 min
            </span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search within menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="border rounded px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-red-200"
              style={{ minWidth: 220 }}
            />
          </div>
        </div>
        <div className="flex flex-col gap-10">
          {filteredCategories.map((cat, idx) => (
            <div
              key={cat.name}
              ref={el => (sectionRefs.current[idx] = el)}
              className="mb-2 transition-all duration-300"
            >
              <h3 className="text-2xl font-bold mt-8 mb-6 text-gray-900">{cat.name}</h3>
              <div className="flex flex-col gap-6">
                {cat.items.length === 0 ? (
                  <span className="text-gray-400">No items found.</span>
                ) : (
                  cat.items.map((ss, i) => {
                    const qty = getCartQty(ss);
                    const hasDiscount = ss.discount && ss.discount > 0;
                    const discountedPrice = getDiscountedPrice(ss);
                    return (
                      <div
                        key={ss._id}
                        className="flex flex-row gap-6 items-start border-b pb-6"
                        style={{ minHeight: 120 }}
                      >
                        {/* Service Image */}
                        <div className="w-28 h-28 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center">
                          {ss.service?.image ? (
                            <img
                              src={ss.service.image}
                              alt={ss.service?.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="material-icons text-5xl text-gray-300">image</span>
                          )}
                        </div>
                        {/* Service Info */}
                        <div className="flex-1 flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span className="border border-green-500 text-green-600 rounded w-5 h-5 flex items-center justify-center text-xs font-bold">🟩</span>
                            <span className="text-lg font-semibold">{ss.service?.name}</span>
                            {ss.isBestseller && (
                              <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded font-semibold">
                                BESTSELLER
                              </span>
                            )}
                            {hasDiscount && (
                              <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">
                                {ss.discount}% OFF
                              </span>
                            )}
                          </div>
                          <span className="text-gray-700 font-medium">
                            {hasDiscount ? (
                              <>
                                <span className="line-through text-gray-400 mr-2">₹{ss.price}</span>
                                <span className="text-green-700 font-bold">₹{discountedPrice}</span>
                              </>
                            ) : (
                              <>₹{ss.price}</>
                            )}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {getShortDescription(ss.service?.description)}
                            {ss.service?.description && ss.service.description.length > 80 && (
                              <span className="text-blue-500 cursor-pointer ml-1" title={ss.service.description}>
                                read more
                              </span>
                            )}
                          </span>
                          <span className="text-gray-500 text-sm">Duration: {ss.duration} min</span>
                          {/* AddToCart */}
                          <div className="mt-2">
                            <AddToCart
                              qty={qty}
                              service={ss}
                              storeId={storeId}
                              onCartChange={setCart}
                              onCartAnim={triggerAnim}
                            />
                          </div>
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
                      </div>
                    );
                  })
                )}
              </div>
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