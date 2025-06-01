import React, { useState } from 'react';

// Dummy data for categories and items
const categories = [
  {
    name: 'New Launch',
    items: [
      { name: 'Aloo Do Pyaza', price: 295 },
      { name: 'Potato Wadges', price: 159 },
      { name: 'Classic Combo', price: 419, desc: 'PCM India Classic Pizza + Stuffed GB + Small Pepsi' },
      { name: 'Do Pyaza Combo', price: 399 },
    ],
  },
  {
    name: 'Veg Classic Pizza',
    items: [
      { name: 'Margherita', price: 199 },
      { name: 'Farmhouse', price: 249 },
    ],
  },
  {
    name: 'Combo',
    items: [
      { name: 'Combo 1', price: 299 },
      { name: 'Combo 2', price: 349 },
    ],
  },
  // ...add more categories as needed
];

const BookOnline = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].name);
  const [search, setSearch] = useState('');

  const selectedCatObj = categories.find(cat => cat.name === selectedCategory);

  // Filter items by search
  const filteredItems = selectedCatObj.items.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

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
          {categories.map(cat => (
            <li
              key={cat.name}
              className={`px-6 py-2 cursor-pointer text-lg ${
                selectedCategory === cat.name
                  ? 'text-red-500 font-bold border-l-4 border-red-400 bg-red-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setSelectedCategory(cat.name)}
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
      {/* Right: Items */}
      <div
        className="flex-1 h-full overflow-y-auto px-10 py-6"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        {/* Top bar with search */}
        <div className="flex items-center gap-4 mb-2 justify-between">
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
        <h3 className="text-xl font-semibold mt-6 mb-4">{selectedCatObj.name}</h3>
        <div className="flex flex-col gap-6">
          {filteredItems.length === 0 ? (
            <span className="text-gray-400">No items found.</span>
          ) : (
            filteredItems.map((item, idx) => (
              <div key={item.name + idx} className="flex flex-col gap-1 border-b pb-4">
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