import React, { useRef, useState, useEffect } from 'react';

// Dummy data for categories and items
const categories = [
  {
    name: 'Newly Added',
    items: [
      { name: 'Aloo Do Pyaza', price: 295 },
      { name: 'Potato Wadges', price: 159 },
      { name: 'Classic Combo', price: 419, desc: 'PCM India Classic Pizza + Stuffed GB + Small Pepsi' },
      { name: 'Do Pyaza Combo', price: 399 },
    ],
  },
  {
    name: 'Haircuts',
    items: [
      { name: 'Margherita', price: 199 },
      { name: 'Farmhouse', price: 249 },
    ],
  },
  {
    name: 'Beard Trims',
    items: [
      { name: 'Combo 1', price: 299 },
      { name: 'Combo 2', price: 349 },
    ],
  },
  {
    name: 'Hair Color',
    items: [
      { name: 'Hair Color 1', price: 499 },
      { name: 'Hair Color 2', price: 599 },
    ],
  },
  {
    name: 'Hair Spa',
    items: [
      { name: 'Spa Treatment', price: 699 },
      { name: 'Deep Conditioning', price: 799 },
    ],
  },
  {
    name: 'Hair Treatments',
    items: [
      { name: 'Keratin Treatment', price: 1299 },
      { name: 'Smoothening', price: 1499 },
    ],
  },
  {
    name: 'Hair Styling',
    items: [
      { name: 'Blow Dry', price: 399 },
      { name: 'Hair Straightening', price: 899 },
    ],
  },
  {
    name: 'Hair Wash',
    items: [
      { name: 'Basic Wash', price: 99 },
      { name: 'Luxury Wash', price: 199 },
    ],
  },
  {
    name: 'Manicure & Pedicure',
    items: [
      { name: 'Basic Manicure', price: 299 },
      { name: 'Deluxe Pedicure', price: 399 },
    ],
  },
  {
    name: 'Facials',
    items: [
      { name: 'Gold Facial', price: 799 },
      { name: 'Fruit Facial', price: 599 },
    ],
  },
  {
    name: 'Waxing',
    items: [
      { name: 'Full Body Wax', price: 999 },
      { name: 'Half Body Wax', price: 599 },
    ],
  },
  {
    name: 'Threading',
    items: [
      { name: 'Eyebrow Threading', price: 99 },
      { name: 'Upper Lip Threading', price: 79 },
    ],
  },
  {
    name: 'Makeup',
    items: [
      { name: 'Party Makeup', price: 1499 },
      { name: 'Bridal Makeup', price: 4999 },
    ],
  },
  {
    name: 'Massage',
    items: [
      { name: 'Swedish Massage', price: 899 },
      { name: 'Deep Tissue Massage', price: 1199 },
    ],
  },

];

const BookOnline = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [search, setSearch] = useState('');
  const rightRef = useRef(null);

  // Filtered items for each category (for search)
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  // For scroll sync: refs for each category section
  const sectionRefs = useRef([]);

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
    if (filteredCategories[foundIdx].name !== selectedCategory) {
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
                cat.items.map((item, i) => (
                  <div key={item.name + i} className="flex flex-col gap-1 border-b pb-4">
                    <div className="flex items-center gap-2">
                      <span className="border border-green-500 text-green-600 rounded w-5 h-5 flex items-center justify-center text-xs font-bold">🟩</span>
                      <span className="text-lg font-semibold">{item.name}</span>
                    </div>
                    <span className="text-gray-700 font-medium">₹{item.price}</span>
                    {item.desc && <span className="text-gray-500 text-sm">{item.desc}</span>}
                  </div>
                ))
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
    </div>
  );
};

export default BookOnline;