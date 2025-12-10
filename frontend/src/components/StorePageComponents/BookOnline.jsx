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
  const [loading, setLoading] = useState(true);
  const rightRef = useRef(null);
  const sectionRefs = useRef([]);

  // Fetch store services - simplified
  useEffect(() => {
    const fetchStoreServices = async () => {
      if (!storeId) return;
      
      setLoading(true);
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/store-services/get-store-services/${storeId}`
        );
        
        const services = res.data || [];
        setStoreServices(services);
        
        // Group by category
        const grouped = {};
        services.forEach(ss => {
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
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setStoreServices([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStoreServices();
  }, [storeId]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!storeId) return;
      
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/stores/${storeId}/reviews`
        );
        
        const reviewsObj = {};
        const ratings = res.data?.ratings || [];
        
        ratings.forEach(r => {
          if (r.service) {
            if (!reviewsObj[r.service]) reviewsObj[r.service] = [];
            reviewsObj[r.service].push(r);
          }
        });
        
        setReviews(reviewsObj);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setReviews({});
      }
    };
    
    fetchReviews();
  }, [storeId]);

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(ss =>
      ss.service?.name?.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  const handleCategoryClick = idx => {
    setSelectedCategory(filteredCategories[idx].name);
    if (sectionRefs.current[idx]) {
      sectionRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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

  const lastScrollCategory = useRef(selectedCategory);
  useEffect(() => {
    if (lastScrollCategory.current !== selectedCategory) {
      lastScrollCategory.current = selectedCategory;
      const idx = filteredCategories.findIndex(cat => cat.name === selectedCategory);
      if (idx !== -1 && sectionRefs.current[idx]) {
        sectionRefs.current[idx].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [selectedCategory]);

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
      return [...prev, { ...ss, qty: 1, storeId }];
    });
    triggerAnim();
  };

  const getCartQty = (ss) => {
    const found = cart.find(item => item._id === ss._id);
    return found ? found.qty : 0;
  };

  const getDiscountedPrice = (ss) => {
    if (ss.discount && ss.discount > 0) {
      return Math.round(ss.price * (1 - ss.discount / 100));
    }
    return ss.price;
  };

  const getShortDescription = (desc, max = 80) => {
    if (!desc) return "";
    return desc.length > max ? desc.slice(0, max) + "..." : desc;
  };

  const getAverageRating = (serviceId) => {
    const serviceReviews = reviews[serviceId] || [];
    if (serviceReviews.length === 0) return 0;
    const sum = serviceReviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    return (sum / serviceReviews.length).toFixed(1);
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-screen bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      {/* Left Sidebar: Categories */}
      <div className="w-64 bg-white border-r border-gray-200 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 z-10">
          <h3 className="text-lg font-bold text-gray-900">Menu</h3>
        </div>
        <ul className="py-2">
          {filteredCategories.map((cat, idx) => (
            <li
              key={cat.name}
              className={`px-6 py-3 cursor-pointer transition-all duration-200 border-l-4 flex items-center justify-between group
                ${selectedCategory === cat.name
                  ? 'bg-gradient-to-r from-orange-50 to-red-50 border-l-orange-500 text-orange-600'
                  : 'border-l-transparent text-gray-700 hover:bg-gray-50'
                }`}
              onClick={() => handleCategoryClick(idx)}
            >
              <span className="font-medium text-sm">{cat.name}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                selectedCategory === cat.name 
                  ? 'bg-orange-200 text-orange-700' 
                  : 'bg-gray-200 text-gray-600 group-hover:bg-gray-300'
              }`}>
                {cat.items.length}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Section: Services */}
      <div
        ref={rightRef}
        className="flex-1 overflow-y-auto"
        style={{ scrollbarWidth: 'none' }}
        onScroll={handleScroll}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-4 z-10 shadow-sm">
          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-900">Order Online</h2>
              <div className="flex items-center gap-6 mt-2">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-icons text-lg">local_shipping</span>
                  Fast Delivery
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="material-icons text-lg">schedule</span>
                  24 min
                </span>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search services..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 w-64 transition-all"
            />
          </div>
        </div>

        {/* Services List */}
        <div className="px-8 py-6 space-y-8">
          {filteredCategories.map((cat, idx) => (
            <div
              key={cat.name}
              ref={el => (sectionRefs.current[idx] = el)}
              className="scroll-mt-20"
            >
              <div className="flex items-center gap-3 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">{cat.name}</h3>
                <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-red-400 rounded"></div>
              </div>

              <div className="space-y-4">
                {cat.items.length === 0 ? (
                  <div className="text-center py-8">
                    <span className="material-icons text-gray-300 text-5xl">search_off</span>
                    <p className="text-gray-400 mt-2">No items found</p>
                  </div>
                ) : (
                  cat.items.map((ss) => {
                    if (!ss) return null;
                    
                    const qty = getCartQty(ss);
                    const hasDiscount = ss.discount && ss.discount > 0;
                    const discountedPrice = getDiscountedPrice(ss);
                    const avgRating = getAverageRating(ss.service?._id);
                    const reviewCount = reviews[ss.service?._id]?.length || 0;
                    const imageUrl = ss?.image?.image?.[0]?.url || null;

                    return (
                      <div
                        key={ss._id}
                        className="group bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-orange-200"
                      >
                        <div className="flex gap-4">
                          {/* Service Image */}
                          <div className="relative flex-shrink-0">
                            <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden flex items-center justify-center group-hover:shadow-lg transition-shadow">
                              {imageUrl ? (
                                <img
                                  src={imageUrl}
                                  alt={ss.service?.name || "Service"}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <span className="material-icons text-6xl text-gray-300">image</span>
                              )}
                            </div>
                            {hasDiscount && (
                              <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold shadow-lg">
                                -{ss.discount}%
                              </div>
                            )}
                          </div>

                          {/* Service Info */}
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h4 className="text-lg font-bold text-gray-900">{ss.service?.name}</h4>
                                {ss.isBestseller && (
                                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-semibold flex items-center gap-1">
                                    <span className="material-icons text-sm">star</span>
                                    Bestseller
                                  </span>
                                )}
                              </div>

                              {/* Rating */}
                              {reviewCount > 0 && (
                                <div className="flex items-center gap-2 mb-2">
                                  <span className="flex items-center gap-1 text-sm font-semibold text-yellow-600">
                                    <span className="material-icons text-base">star</span>
                                    {avgRating}
                                  </span>
                                  <span className="text-xs text-gray-500">({reviewCount} reviews)</span>
                                </div>
                              )}

                              <p className="text-gray-600 text-sm mb-2">
                                {getShortDescription(ss.service?.description)}
                              </p>
                              <p className="text-gray-500 text-xs flex items-center gap-1">
                                <span className="material-icons text-base">schedule</span>
                                {ss.duration} min
                              </p>
                            </div>

                            {/* Price & Add to Cart */}
                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-baseline gap-2">
                                {hasDiscount ? (
                                  <>
                                    <span className="text-2xl font-bold text-green-600">₹{discountedPrice}</span>
                                    <span className="text-sm line-through text-gray-400">₹{ss.price}</span>
                                  </>
                                ) : (
                                  <span className="text-2xl font-bold text-gray-900">₹{ss.price}</span>
                                )}
                              </div>
                              <AddToCart
                                qty={qty}
                                service={ss}
                                storeId={storeId}
                                onCartChange={setCart}
                                onCartAnim={triggerAnim}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Reviews Preview */}
                        {reviewCount > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-700 mb-2">Recent Reviews</p>
                            <div className="space-y-1">
                              {reviews[ss.service?._id]?.slice(0, 2).map((review, i) => (
                                <p key={review._id || i} className="text-xs text-gray-600 line-clamp-2">
                                  <span className="font-semibold">{review.user?.name || 'User'}:</span> {review.reviewText}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart Animation */}
      <CartAnimation show={showAnim} cartCount={cart.reduce((a, b) => a + b.qty, 0)} />

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default BookOnline;