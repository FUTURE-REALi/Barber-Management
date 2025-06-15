import React, { useEffect, useState } from "react";
import axios from "axios";
import { StoreDataContext } from "../../context/StoreContext";
import { useContext } from "react";

const MenuSection = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIdx, setEditIdx] = useState(null);
  const [editData, setEditData] = useState({});
  const [addData, setAddData] = useState({ name: "", description: "", price: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const {storeData, setStoreData} = useContext(StoreDataContext);


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

  const handleAddChange = (e) => {
    setAddData({ ...addData, [e.target.name]: e.target.value });
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError("");
    setSuccessMsg("");
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/stores/addstoreservice`,
        {
          name: addData.name,
          description: addData.description,
          price: addData.price,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMsg("Service added successfully!");
      setAddData({ name: "", description: "", price: "" });
      fetchServices();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to add service"
      );
    }
    setAdding(false);
  };

  return (
    <div className="p-8">
      <h2 className="text-xl font-bold mb-4">Store Services</h2>
      {loading && <div>Loading services...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {successMsg && <div className="text-green-600 mb-4">{successMsg}</div>}
      {/* Add New Service */}
      <form
        className="mb-8 bg-gray-50 p-4 rounded shadow flex flex-col md:flex-row gap-4 items-end"
        onSubmit={handleAddService}
      >
        <div>
          <label className="block text-sm font-semibold mb-1">Service Name</label>
          <input
            type="text"
            name="name"
            value={addData.name}
            onChange={handleAddChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Description</label>
          <input
            type="text"
            name="description"
            value={addData.description}
            onChange={handleAddChange}
            required
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={addData.price}
            onChange={handleAddChange}
            required
            min={0}
            className="border px-2 py-1 rounded w-full"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          disabled={adding}
        >
          {adding ? "Adding..." : "Add Service"}
        </button>
      </form>
      {/* List Services */}
      <div className="space-y-4">
        {services.length === 0 && !loading && (
          <div>No services found for this store.</div>
        )}
        {services.map((s, idx) => (
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
                </>
              ) : (
                <>
                  <div className="font-semibold text-lg mb-1">
                    {s.service?.name}
                  </div>
                  <div className="text-gray-500 text-sm mb-1">
                    {s.service?.description}
                  </div>
                  <div className="text-gray-500 text-sm mb-1">
                    Price: <span className="font-semibold">₹{s.price}</span>
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
        ))}
      </div>
    </div>
  );
};

export default MenuSection;