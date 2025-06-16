import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import OrdersSection from '../components/StoreHomePageComponents/OrdersSection';
import MenuSection from '../components/StoreHomePageComponents/MenuSection';
import OrderHistorySection from '../components/StoreHomePageComponents/OrderHistorySection';
import InsightsSection from '../components/StoreHomePageComponents/InsightsSection';
import CampaignsSection from '../components/StoreHomePageComponents/CampaignsSection';
import PayoutSection from '../components/StoreHomePageComponents/PayoutSection';
import OutletInfoSection from '../components/StoreHomePageComponents/OutletInfoSection';
import HelpCentreSection from '../components/StoreHomePageComponents/HelpCentreSection';

const sidebarOptions = [
  { label: "Orders", icon: "list_alt", path: "/storehomepage/orders" },
  { label: "Menu", icon: "restaurant_menu", path: "/storehomepage/menu" },
  { label: "Order history", icon: "history", path: "/storehomepage/order-history" },
  { label: "Insights", icon: "insights", path: "/storehomepage/insights" },
  { label: "Campaigns", icon: "campaign", path: "/storehomepage/campaigns" },
  { label: "Payout", icon: "payments", path: "/storehomepage/payout" },
  { label: "Outlet info", icon: "store", path: "/storehomepage/outlet-info" },
  { label: "Help centre", icon: "help", path: "/storehomepage/help-centre" },
];

const StoreHomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to orders if at /storehomepage or /storehomepage/
  useEffect(() => {
    if (
      location.pathname === "/storehomepage" ||
      location.pathname === "/storehomepage/"
    ) {
      navigate("/storehomepage/orders", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="min-h-screen h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r flex flex-col h-screen">
        <div className="mb-8 px-4 pt-6">
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight block mb-6">PocketSalon</span>
        </div>
        <nav className="flex-1 flex flex-col gap-2 px-4">
          {sidebarOptions.map(opt => (
            <button
              key={opt.label}
              className={`rounded px-3 py-2 flex items-center gap-2 font-semibold transition
                ${
                  location.pathname === opt.path
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }
              `}
              onClick={() => navigate(opt.path)}
            >
              <span className="material-icons text-base">{opt.icon}</span> {opt.label}
            </button>
          ))}
        </nav>
        <div className="mt-auto px-4 pb-6">
          <button className="w-full text-gray-700 hover:bg-gray-100 rounded px-3 py-2 flex items-center gap-2">
            <span className="material-icons text-base">logout</span> Logout
          </button>
        </div>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-0 flex flex-col overflow-y-auto">
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