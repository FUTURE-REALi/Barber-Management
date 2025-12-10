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
  const [deleteLoading, setDeleteLoading] = useState(null);
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
      duration: services[idx].duration || "",
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
          duration: editData.duration,
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

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    setDeleteLoading(serviceId);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/store-services/delete-store-service/${serviceId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMsg("Service deleted successfully!");
      fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to delete service"
      );
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAddServiceSubmit = async (e, formData) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/services/add-service`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.status === 201 && response.data?.service?._id) {
        const newServiceId = response.data.service._id;
        const imageUrl = response.data.image;

        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/store-services/add-store-service`,
          {
            store: storeData._id,
            service: newServiceId,
            price: Number(formData.get("price")),
            duration: Number(formData.get("duration")),
            image: imageUrl,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setShowAdd(false);
        fetchServices();
        setSuccessMsg("Service added successfully!");
      } else {
        console.log("Unexpected response:", response);
        setError("Failed to add service. Unexpected response.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to add service"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <span className="material-icons text-5xl text-blue-600">menu</span>
            Store Services
          </h1>
          <p className="text-gray-600 mt-2">
            Manage and organize your salon services
          </p>
        </div>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center gap-2 font-semibold"
          onClick={() => setShowAdd(true)}
        >
          <span className="material-icons">add_circle</span>
          Add New Service
        </button>
      </div>

      {/* Alert Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm">
          <span className="material-icons text-red-500">error</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError("")}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
      {successMsg && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 px-6 py-4 rounded-lg flex items-center gap-3 shadow-sm">
          <span className="material-icons text-green-500">check_circle</span>
          <div>
            <p className="font-semibold">Success</p>
            <p className="text-sm">{successMsg}</p>
          </div>
          <button
            onClick={() => setSuccessMsg("")}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}

      {/* AddService Modal */}
      {showAdd && (
        <AddService
          onClose={() => setShowAdd(false)}
          onSubmit={handleAddServiceSubmit}
        />
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading services...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <span className="material-icons text-6xl text-gray-300 block mb-4">
            inventory_2
          </span>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Services Yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start by adding your first service to your salon
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            onClick={() => setShowAdd(true)}
          >
            Add Your First Service
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => {
            if (!s) return null; 
            
            const hasDiscount = s.discount && s.discount > 0;
            const discountedPrice = hasDiscount
              ? Math.round(s.price * (1 - s.discount / 100))
              : s.price;
            
            // Extract image URL safely
            const imageUrl = s?.image?.image?.[0]?.url || null;

            return (
              <React.Fragment key={s._id}>
                <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:scale-105">
                  {/* Image Section */}
                  <div className="relative h-40 bg-gradient-to-br from-gray-200 to-gray-300">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={s.service?.name || "Service"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-icons text-6xl text-gray-400">
                          image
                        </span>
                      </div>
                    )}
                    {hasDiscount ? (
                      <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                        -{s.discount}%
                      </div>
                    ) : null}
                  </div>

                  {/* Content Section */}
                  <div className="p-5">
                    {editIdx === idx ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Service Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={editData.name}
                            disabled
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 font-semibold text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            name="description"
                            value={editData.description}
                            onChange={handleEditChange}
                            rows="2"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                            placeholder="Service description"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Price (₹)
                            </label>
                            <input
                              type="number"
                              name="price"
                              value={editData.price}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                              Duration (min)
                            </label>
                            <input
                              type="number"
                              name="duration"
                              value={editData.duration}
                              onChange={handleEditChange}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Discount (%)
                          </label>
                          <input
                            type="number"
                            name="discount"
                            value={editData.discount}
                            onChange={handleEditChange}
                            min={0}
                            max={100}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="0"
                          />
                        </div>
                        <div className="flex gap-2 pt-3">
                          <button
                            className="flex-1 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-semibold text-sm flex items-center justify-center gap-1"
                            onClick={() => handleEditSave(s)}
                          >
                            <span className="material-icons text-base">check</span>
                            Save
                          </button>
                          <button
                            className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition font-semibold text-sm flex items-center justify-center gap-1"
                            onClick={() => setEditIdx(null)}
                          >
                            <span className="material-icons text-base">close</span>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1">
                          {s.service?.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {s.service?.description || "No description"}
                        </p>

                        {/* Duration Badge */}
                        {s.duration ? (
                          <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                            <span className="material-icons text-base">schedule</span>
                            <span>{s.duration} minutes</span>
                          </div>
                        ) : null}

                        {/* Price Section */}
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          {hasDiscount ? (
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="line-through text-gray-400 text-sm">
                                  ₹{s.price}
                                </span>
                                <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded">
                                  -{s.discount}%
                                </span>
                              </div>
                              <p className="text-2xl font-bold text-green-600">
                                ₹{discountedPrice}
                              </p>
                            </div>
                          ) : (
                            <p className="text-2xl font-bold text-gray-900">
                              ₹{s.price}
                            </p>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <button
                            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm flex items-center justify-center gap-1"
                            onClick={() => handleEdit(idx)}
                          >
                            <span className="material-icons text-base">edit</span>
                            Edit
                          </button>
                          <button
                            className="flex-1 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                            onClick={() => handleDeleteService(s._id)}
                            disabled={deleteLoading === s._id}
                          >
                            <span className="material-icons text-base">
                              {deleteLoading === s._id ? "hourglass_empty" : "delete"}
                            </span>
                            {deleteLoading === s._id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuSection;