import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { StoreDataContext } from "../../context/StoreContext";
import HandleRazorpayPayment from "../PaymentComponents/HandleRazorpayPayement";

const CampaignsSection = () => {
  // Advertising state
  const [adService, setAdService] = useState("");
  const [adBudget, setAdBudget] = useState("");
  const [adDuration, setAdDuration] = useState("");
  const [adSuccess, setAdSuccess] = useState("");
  const [showPayment, setShowPayment] = useState(false);

  // Promocode state
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState("");
  const [promoExpiry, setPromoExpiry] = useState("");
  const [promoSuccess, setPromoSuccess] = useState("");

  // Per-service discount state
  const [services, setServices] = useState([]);
  const [serviceDiscounts, setServiceDiscounts] = useState({});
  const [discountMsg, setDiscountMsg] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);

  const { storeData } = useContext(StoreDataContext);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/store-services/get-store-services/${storeData._id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setServices(res.data || []);
      const discounts = {};
      (res.data || []).forEach((s) => {
        discounts[s._id] = s.discount || 0;
      });
      setServiceDiscounts(discounts);
    } catch {
      setServices([]);
    }
  };

  // Advertising: open payment modal
  const handleAdSubmit = (e) => {
    e.preventDefault();
    setShowPayment(true);
  };

  // After payment, create campaign in backend
  const handleAdPaymentSuccess = async (paymentData) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/campaign/create`,
        {
          service: adService,
          budget: adBudget,
          duration: adDuration,
          paymentId: paymentData.razorpay_payment_id,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAdSuccess(
        `Your store is now advertised for "${adService}" for ₹${adBudget} (${adDuration} days)!`
      );
      setAdService("");
      setAdBudget("");
      setAdDuration("");
    } catch {
      setAdSuccess("Failed to create campaign after payment.");
    }
    setShowPayment(false);
  };

  // Promocode: call backend
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/promocode/create`,
        {
          code: promoCode,
          discount: promoDiscount,
          expiry: promoExpiry,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPromoSuccess(
        `Promocode "${promoCode}" created for ${promoDiscount}% off, valid till ${promoExpiry}.`
      );
      setPromoCode("");
      setPromoDiscount("");
      setPromoExpiry("");
    } catch (err) {
      setPromoSuccess("Failed to create promocode.");
    }
  };

  // Per-service discount
  const handleDiscountChange = (serviceId, value) => {
    setServiceDiscounts((prev) => ({
      ...prev,
      [serviceId]: value,
    }));
  };

  const handleDiscountSave = async (serviceId) => {
    setDiscountLoading(true);
    setDiscountMsg("");
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/store-services/update-store-service/${serviceId}`,
        { discount: serviceDiscounts[serviceId] },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setDiscountMsg("Discount updated!");
      fetchServices();
      setTimeout(() => setDiscountMsg(""), 2000);
    } catch {
      setDiscountMsg("Failed to update discount.");
    }
    setDiscountLoading(false);
  };

  // Prepare cart for payment component (simulate a single item for ad payment)
  const adCart = [
    {
      price: Number(adBudget),
      qty: 1,
      name: adService,
      store: storeData._id,
      _id: "ad-campaign",
    },
  ];
  const userData = {
    email: storeData.email,
    phone: storeData.phone,
    _id: storeData._id,
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Campaigns & Promotions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Advertise Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Advertise Your Store</h3>
          <form onSubmit={handleAdSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">
                Select Service to Advertise
              </label>
              <select
                className="border px-2 py-1 rounded w-full"
                value={adService}
                onChange={(e) => setAdService(e.target.value)}
                required
              >
                <option value="">Select a service</option>
                {services.map((s) => (
                  <option key={s._id} value={s.service?.name}>
                    {s.service?.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Budget (₹)</label>
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={adBudget}
                onChange={(e) => setAdBudget(e.target.value)}
                min={100}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Duration (days)</label>
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={adDuration}
                onChange={(e) => setAdDuration(e.target.value)}
                min={1}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Pay & Advertise
            </button>
            {adSuccess && (
              <div className="text-green-700 mt-2 font-semibold">{adSuccess}</div>
            )}
          </form>
          <div className="mt-6 text-gray-500 text-sm">
            <span className="font-semibold">Note:</span> Your store will be featured on our platform for the selected service and duration after payment.
          </div>
        </div>

        {/* Promocode Section */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Create Offer / Promocode</h3>
          <form onSubmit={handlePromoSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Promocode</label>
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                required
                maxLength={20}
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Discount (%)</label>
              <input
                type="number"
                className="border px-2 py-1 rounded w-full"
                value={promoDiscount}
                onChange={(e) => setPromoDiscount(e.target.value)}
                min={1}
                max={100}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Expiry Date</label>
              <input
                type="date"
                className="border px-2 py-1 rounded w-full"
                value={promoExpiry}
                onChange={(e) => setPromoExpiry(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Create Promocode
            </button>
            {promoSuccess && (
              <div className="text-green-700 mt-2 font-semibold">{promoSuccess}</div>
            )}
          </form>
          <div className="mt-6 text-gray-500 text-sm">
            <span className="font-semibold">Tip:</span> Promocodes can be used by customers at checkout for instant discounts.
          </div>
        </div>
      </div>

      {/* Razorpay Payment Modal for Ad */}
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-lg p-8 shadow-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
            <HandleRazorpayPayment
              cart={adCart}
              userData={userData}
              onPaymentSuccess={handleAdPaymentSuccess}
              onClose={() => setShowPayment(false)}
            />
            <button
              className="mt-4 text-gray-600 underline"
              onClick={() => setShowPayment(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Per-Service Discount Customization */}
      <div className="bg-white rounded-xl shadow p-6 mt-10">
        <h3 className="text-lg font-semibold mb-4">Customize Discount Per Service</h3>
        <div className="space-y-4">
          {services.length === 0 && (
            <div className="text-gray-500">No services found for this store.</div>
          )}
          {services.map((s) => (
            <div
              key={s._id}
              className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4"
            >
              <div>
                <div className="font-semibold text-lg">{s.service?.name}</div>
                <div className="text-gray-500 text-sm">{s.service?.description}</div>
                <div className="text-gray-500 text-sm">
                  Price: <span className="font-semibold">₹{s.price}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <label className="font-medium">Discount (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="border px-2 py-1 rounded w-20"
                  value={serviceDiscounts[s._id] || ""}
                  onChange={(e) =>
                    handleDiscountChange(s._id, e.target.value)
                  }
                />
                <button
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                  onClick={() => handleDiscountSave(s._id)}
                  disabled={discountLoading}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
        {discountMsg && (
          <div className="text-green-700 mt-4 font-semibold">{discountMsg}</div>
        )}
      </div>
    </div>
  );
};

export default CampaignsSection;