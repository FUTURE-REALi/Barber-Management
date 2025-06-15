import React from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import OrdersSection from '../components/StoreHomePageComponents/OrdersSection';
import MenuSection from '../components/StoreHomePageComponents/MenuSection';
import OrderHistorySection from '../components/StoreHomePageComponents/OrderHistorySection';
import InsightsSection from '../components/StoreHomePageComponents/InsightsSection';
import CampaignsSection from '../components/StoreHomePageComponents/CampaignsSection';
import PayoutSection from '../components/StoreHomePageComponents/PayoutSection';
import OutletInfoSection from '../components/StoreHomePageComponents/OutletInfoSection';
import HelpCentreSection from '../components/StoreHomePageComponents/HelpCentreSection';

const StoreHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col py-6 px-4">
        <div className="mb-8">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight block mb-6">PocketSalon</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2">
          <button className={`text-blue-600 font-semibold bg-blue-50 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/orders') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/orders')}>
            <span className="material-icons text-base">list_alt</span> Orders
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/menu') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/menu')}>
            <span className="material-icons text-base">restaurant_menu</span> Menu
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/order-history') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/order-history')}>
            <span className="material-icons text-base">history</span> Order history
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/insights') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/insights')}>
            <span className="material-icons text-base">insights</span> Insights
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/campaigns') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/campaigns')}>
            <span className="material-icons text-base">campaign</span> Campaigns
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/payout') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/payout')}>
            <span className="material-icons text-base">payments</span> Payout
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/outlet-info') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/outlet-info')}>
            <span className="material-icons text-base">store</span> Outlet info
          </button>
          <button className={`text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 ${location.pathname.endsWith('/help-centre') ? 'bg-blue-100' : ''}`}
            onClick={() => navigate('/storehomepage/help-centre')}>
            <span className="material-icons text-base">help</span> Help centre
          </button>
          <button className="text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2 mt-auto">
            <span className="material-icons text-base">logout</span> Logout
          </button>
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 flex flex-col">
        <Routes>
          <Route path="orders" element={<OrdersSection />} />
          <Route path="menu" element={<MenuSection />} />
          <Route path="order-history" element={<OrderHistorySection />} />
          <Route path="insights" element={<InsightsSection />} />
          <Route path="campaigns" element={<CampaignsSection />} />
          <Route path="payout" element={<PayoutSection />} />
          <Route path="outlet-info" element={<OutletInfoSection />} />
          <Route path="help-centre" element={<HelpCentreSection />} />
        </Routes>
      </main>
    </div>
  );
};

export default StoreHomePage;