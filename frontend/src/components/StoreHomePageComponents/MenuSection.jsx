import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreDataContext } from "../../context/StoreContext";
import AddService from "../StoreSetupComponents/AddService";

const MenuSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const { storeData } = useContext(StoreDataContext);

  useEffect(() => {
    fetchServices();
    // eslint-disable-next-line
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError("");
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
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to fetch services"
      );
    }
    setLoading(false);
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditData({
      name: services[idx].service?.name || "",
      description: services[idx].service?.description || "",
      price: services[idx].price || "",
      discount: services[idx].discount || 0,
    });
    setSuccessMsg("");
    setError("");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleEditSave = async (serviceObj) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BASE_URL}/store-services/update-store-service/${serviceObj._id}`,
        {
          price: editData.price,
          description: editData.description,
          discount: editData.discount,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMsg("Service updated successfully!");
      setEditIdx(null);
      fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to update service"
      );
    }
  };

  // Add service globally, then add to storeService (like SetupPage3)
  const handleAddServiceSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      // 1. Add the service globally
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/services/add-service`,
        formData
      );
      if (response.status === 201 && response.data && response.data._id) {
        const newServiceId = response.data._id;

        // 2. Add to storeService for this store
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/store-services/add-store-service`,
          {
            store: storeData._id,
            service: newServiceId,
            price: formData.price,
            duration: formData.duration,
            discount: formData.discount || 0,
          },
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setShowAdd(false);
        fetchServices();
        setSuccessMsg("Service added successfully!");
      } else {
        alert("Failed to add service.");
      }
    } catch (err) {
      alert("Failed to add service.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Store Services</h2>
      {loading && <div>Loading services...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>}
      {/* Add New Service Button */}
      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          onClick={() => setShowAdd(true)}
        >
          Add New Service
        </button>
      </div>
      {/* AddService Modal */}
      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <AddService
            onClose={() => setShowAdd(false)}
            onSubmit={handleAddServiceSubmit}
          />
        </div>
      )}
      {/* List Services */}
      <div className="space-y-4">
        {services.length === 0 && !loading && (
          <div>No services found for this store.</div>
        )}
        {services.map((s, idx) => {
          const hasDiscount = s.discount && s.discount > 0;
          const discountedPrice = hasDiscount
            ? Math.round(s.price * (1 - s.discount / 100))
            : s.price;
          return (
            <div
              key={s._id}
              className="border rounded-lg p-4 bg-white shadow flex flex-col md:flex-row md:items-center justify-between"
            >
              <div>
                {editIdx === idx ? (
                  <>
                    <input
                      type="text"
                      name="name"
                      value={editData.name}
                      disabled
                      className="font-semibold text-lg mb-1 border px-2 py-1 rounded w-full"
                    />
                    <input
                      type="text"
                      name="description"
                      value={editData.description}
                      onChange={handleEditChange}
                      className="text-gray-500 text-sm mb-1 border px-2 py-1 rounded w-full"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editData.price}
                      onChange={handleEditChange}
                      className="text-gray-500 text-sm mb-1 border px-2 py-1 rounded w-full"
                    />
                    <input
                      type="number"
                      name="discount"
                      value={editData.discount}
                      onChange={handleEditChange}
                      min={0}
                      max={100}
                      className="text-gray-500 text-sm mb-1 border px-2 py-1 rounded w-full"
                      placeholder="Discount (%)"
                    />
                  </>
                ) : (
                  <>
                    <div className="font-semibold text-lg mb-1 flex items-center gap-2">
                      {s.service?.name}
                    </div>
                    <div className="text-gray-500 text-sm mb-1">
                      {s.service?.description}
                    </div>
                    <div className="text-gray-500 text-sm mb-1">
                      {hasDiscount ? (
                        <>
                          <span className="line-through text-gray-400 mr-2">
                            ₹{s.price}
                          </span>
                          <span className="text-green-700 font-bold">
                            ₹{discountedPrice}
                          </span>
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded font-semibold">
                            {s.discount}% OFF
                          </span>
                        </>
                      ) : (
                        <>Price: <span className="font-semibold">₹{s.price}</span></>
                      )}
                    </div>
                  </>
                )}
              </div>
              <div className="mt-4 md:mt-0 md:ml-4 flex gap-2">
                {editIdx === idx ? (
                  <>
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleEditSave(s)}
                    >
                      Save
                    </button>
                    <button
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={() => setEditIdx(null)}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => handleEdit(idx)}
                  >
                    Edit
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MenuSection;