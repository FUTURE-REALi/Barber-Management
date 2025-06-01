import React, { useState } from 'react';

const ordersSample = [
  {
    id: '174404 0262',
    type: 'ZOMATO DELIVERY',
    status: 'Preparing',
    placedAt: '2:00 pm',
    acceptedAt: '2:02 pm',
    customer: "Rahul's 3rd order",
    restaurant: 'Kebab & Curry',
    address: 'Sector 43, Gurgaon',
    items: [
      { name: 'Paneer Kebab', qty: 1, price: 405, status: 'ready' },
      { name: 'Chicken Tikka Kebab', qty: 1, price: 445, status: 'pending' },
    ],
    total: 850,
    payment: 'PAID',
    delivery: {
      partner: 'Raghav',
      status: 'on the way',
      track: true,
      call: true,
      arriving: '8 mins',
    },
    support: true,
    print: true,
    orderReadyTime: '12.24',
  },
  {
    id: '174404 0181',
    type: 'SELF DELIVERY',
    status: 'Preparing',
    placedAt: '2:15 pm',
    acceptedAt: '2:16 pm',
    customer: "Sanjana's 8th order",
    restaurant: 'Mexican Delights',
    address: 'Galleria Market, Gurgaon',
    items: [
      { name: 'Guac Bowl', qty: 1, price: 600, status: 'ready' },
      { name: 'Chipotle Chicken Burrito', qty: 2, price: 560, status: 'pending' },
    ],
    total: 1160,
    payment: 'CASH',
    delivery: {
      address: 'A-22, One Horizon Centre, Golf Course Road, DLF Phase 5, Sector 43',
    },
    support: true,
    print: true,
    orderReadyTime: '10.12',
  },
];

const tabs = [
  { label: 'Preparing', count: 2 },
  { label: 'Ready', count: 1 },
  { label: 'Picked up', count: 2 },
];

const StoreHomePage = () => {
  const [activeTab, setActiveTab] = useState('Preparing');
  const [search, setSearch] = useState('');
  const [isOnline, setIsOnline] = useState(true);

  // Filter orders by search
  const filteredOrders = ordersSample.filter(order =>
    order.id.toLowerCase().includes(search.toLowerCase()) ||
    order.customer.toLowerCase().includes(search.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col py-6 px-4">
        <div className="mb-8">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight block mb-6">PocketSalon</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <button className="text-blue-600 font-semibold bg-blue-50 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">list_alt</span> Orders
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">restaurant_menu</span> Menu
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">history</span> Order history
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">insights</span> Insights
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">campaign</span> Campaigns
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">payments</span> Payout
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">store</span> Outlet info
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">help</span> Help centre
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 mt-auto">
            <span className="material-icons text-base">logout</span> Logout
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 flex flex-col">
        {/* Navbar */}
        <div className="flex items-center justify-between px-8 py-4 bg-white border-b shadow-sm">
          <div className="flex gap-4">
            {tabs.map(tab => (
              <button
                key={tab.label}
                className={`px-4 py-2 rounded-t-lg border-b-2 font-semibold transition ${
                  activeTab === tab.label
                    ? 'border-blue-600 text-blue-700 bg-white'
                    : 'border-transparent text-gray-500 bg-gray-100 hover:text-blue-600'
                }`}
                onClick={() => setActiveTab(tab.label)}
              >
                {tab.label}
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full">{tab.count}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Search orders, items or customer"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="px-3 py-2 border rounded text-sm bg-gray-50 focus:outline-none"
              style={{ minWidth: 220 }}
            />
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
              <span>{isOnline ? '3 online' : '0 online'}</span>
              <span className="text-gray-400">|</span>
              <span>{isOnline ? '1 offline' : '4 offline'}</span>
            </div>
            <button
              className={`px-4 py-2 rounded font-semibold transition ${
                isOnline
                  ? 'bg-green-100 text-green-700 border border-green-400 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 border border-red-400 hover:bg-red-200'
              }`}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? 'Go Offline' : 'Go Online'}
            </button>
          </div>
        </div>
        {/* Orders List */}
        <div className="flex flex-col gap-6 p-8">
          {filteredOrders.map((order, idx) => (
            <div key={order.id} className="bg-white rounded-xl shadow border p-6 flex flex-col md:flex-row gap-6">
              {/* Left: Order Info */}
              <div className="flex-1 min-w-[250px]">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded ${order.type === 'ZOMATO DELIVERY' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {order.type}
                  </span>
                  <span className="text-gray-500 text-xs">{order.address}</span>
                </div>
                <div className="text-xs text-gray-500 mb-1">ID: {order.id}</div>
                <div className="text-xs text-gray-500 mb-1">{order.customer}</div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <span>Placed</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  <span>{order.placedAt}</span>
                  <span>Accepted</span>
                  <span className="w-2 h-2 bg-green-400 rounded-full inline-block"></span>
                  <span>{order.acceptedAt}</span>
                </div>
              </div>
              {/* Middle: Items */}
              <div className="flex-1 min-w-[250px]">
                <div className="mb-2">
                  {order.items.map((item, i) => (
                    <div key={i} className={`flex items-center gap-2 text-base ${item.status === 'pending' ? 'text-red-600' : 'text-green-700'}`}>
                      <span>{item.qty} x {item.name}</span>
                      <span className="ml-auto font-semibold">₹{item.price}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <span>Total bill</span>
                  <span className={`font-bold px-2 py-1 rounded ${order.payment === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {order.payment} ₹{order.total}
                  </span>
                  {order.print && (
                    <button className="ml-2 text-blue-600 hover:underline text-xs">Print bill</button>
                  )}
                </div>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                  Order ready ({order.orderReadyTime})
                </button>
              </div>
              {/* Right: Delivery/Support */}
              <div className="flex-1 min-w-[250px] flex flex-col gap-2">
                {order.delivery.partner ? (
                  <>
                    <div className="text-sm font-semibold mb-1">Delivery partner details</div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center font-bold text-blue-700">R</span>
                      <span>{order.delivery.partner} is {order.delivery.status}</span>
                    </div>
                    <div className="flex gap-2 mb-1">
                      <button className="text-blue-600 text-xs underline">Track</button>
                      <button className="text-blue-600 text-xs underline">Call</button>
                    </div>
                    <div className="text-xs text-gray-500 mb-1">Arriving in <span className="font-bold text-green-700">{order.delivery.arriving}</span></div>
                  </>
                ) : (
                  <>
                    <div className="text-sm font-semibold mb-1">Delivery address</div>
                    <div className="text-xs text-gray-700">{order.delivery.address}</div>
                  </>
                )}
                <button className="mt-2 text-blue-600 text-xs underline">Support</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StoreHomePage;