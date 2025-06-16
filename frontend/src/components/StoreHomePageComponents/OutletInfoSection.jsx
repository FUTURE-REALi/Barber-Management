import React, { useContext, useState } from "react";
import axios from "axios";
import { StoreDataContext } from "../../context/StoreContext";

const OutletInfoSection = () => {
  const { storeData, setStoreData } = useContext(StoreDataContext);

  // Prepare address fields from object or fallback to empty
  const initialAddress =
    typeof storeData?.address === "object"
      ? storeData.address
      : { building: "", city: "", state: "", zip: "" };

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    address: initialAddress,
    phone: storeData?.phone || "",
    activeHours: storeData?.activeHours || "09:00-21:00",
    status: storeData?.status || "online",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setForm((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleStatusToggle = () => {
    setForm((prev) => ({
      ...prev,
      status: prev.status === "online" ? "offline" : "online",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/stores/update/${storeData._id}`,
        {
          address: form.address,
          phone: form.phone,
          activeHours: form.activeHours,
          status: form.status,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMsg("Outlet info updated!");
      setEditMode(false);
      setStoreData((prev) => ({
        ...prev,
        ...res.data,
      }));
    } catch {
      setMsg("Failed to update outlet info.");
    }
    setLoading(false);
  };

  return (
    <div className="p-8 flex justify-center items-start min-h-[80vh] bg-gradient-to-br from-blue-50 to-white">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold mb-8 text-blue-800 tracking-tight flex items-center gap-2">
          <span className="material-icons text-blue-600 text-4xl">store</span>
          Outlet Information
        </h2>
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
          {!editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-gray-500 font-semibold mb-1">Building</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.address?.building || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">City</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.address?.city || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">State</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.address?.state || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">Zip</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.address?.zip || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">Phone</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.phone || "-"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">Active Hours</div>
                  <div className="text-lg text-gray-800 font-medium">
                    {storeData?.activeHours || "09:00-21:00"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 font-semibold mb-1">Store Status</div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
                      storeData?.status === "online"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : "bg-red-100 text-red-700 border border-red-200"
                    }`}
                  >
                    {storeData?.status === "online" ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-blue-700 transition"
                  onClick={() => setEditMode(true)}
                >
                  <span className="material-icons align-middle mr-1 text-base">edit</span>
                  Edit Info
                </button>
              </div>
            </>
          ) : (
            <form
              className="flex flex-col gap-5"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">Building</label>
                  <input
                    type="text"
                    name="building"
                    value={form.address.building}
                    onChange={handleAddressChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={form.address.city}
                    onChange={handleAddressChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={form.address.state}
                    onChange={handleAddressChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">Zip</label>
                  <input
                    type="text"
                    name="zip"
                    value={form.address.zip}
                    onChange={handleAddressChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">Active Hours</label>
                  <input
                    type="text"
                    name="activeHours"
                    value={form.activeHours}
                    onChange={handleChange}
                    className="border px-3 py-2 rounded-lg w-full focus:ring-2 focus:ring-blue-200"
                    placeholder="09:00-21:00"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-blue-700">Store Status</label>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg font-bold shadow-sm border ${
                      form.status === "online"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-red-100 text-red-700 border-red-200"
                    }`}
                    onClick={handleStatusToggle}
                  >
                    {form.status === "online" ? "Online" : "Offline"}
                  </button>
                </div>
              </div>
              <div className="flex gap-4 justify-end mt-2">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition"
                  disabled={loading}
                >
                  <span className="material-icons align-middle mr-1 text-base">save</span>
                  Save
                </button>
                <button
                  type="button"
                  className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-semibold shadow hover:bg-gray-400 transition"
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                >
                  <span className="material-icons align-middle mr-1 text-base">cancel</span>
                  Cancel
                </button>
              </div>
              {msg && (
                <div className="mt-2 text-center font-semibold text-green-700">
                  {msg}
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutletInfoSection;