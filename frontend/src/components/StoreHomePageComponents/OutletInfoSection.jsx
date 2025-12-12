import React, { useContext, useState, useMemo, useEffect } from "react";
import axios from "axios";
import { StoreDataContext } from "../../context/StoreContext";

const FIELD_CONFIG = [
  { key: "building", label: "Building", icon: "location_on" },
  { key: "city", label: "City", icon: "place" },
  { key: "state", label: "State", icon: "map" },
  { key: "zip", label: "Zip Code", icon: "markunread_mailbox" },
];
const EXTRA_FIELDS = [
  { key: "phone", label: "Phone", icon: "phone" },
  { key: "activeHours", label: "Active Hours", icon: "schedule", fallback: "09:00-21:00" },
];

const MediaCard = ({
  type,
  title,
  icon,
  color,
  existingImages,
  isMulti,
  editingType,
  setEditingType,
  imageFiles,
  setImageFiles,
  imagePreviews,
  setImagePreviews,
  uploadMessages,
  uploadingType,
  handleFileChange,
  handleUploadImages,
}) => {
  const hasExisting = isMulti ? existingImages.length > 0 : !!existingImages;
  const isEditing = editingType === type;
  const resetLocal = () => {
    setImageFiles((p) => ({ ...p, [type]: isMulti ? [] : null }));
    setImagePreviews((p) => ({ ...p, [type]: isMulti ? [] : null }));
    setEditingType(null);
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 hover:shadow-md transition flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <p className="font-semibold text-gray-900 flex items-center gap-2">
          <span className="material-icons text-base" style={{ color }}>{icon}</span>
          {title}
        </p>
        {hasExisting && !isEditing && (
          <button
            onClick={() => setEditingType(type)}
            className="text-xs px-2 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
          >
            <span className="material-icons align-middle" style={{ fontSize: "14px" }}>edit</span>
          </button>
        )}
      </div>

      {hasExisting && !isEditing && (
        <div className="flex-1">
          <p className="text-xs text-gray-500 font-semibold mb-3">Current Images</p>
          {isMulti ? (
            <div className="grid grid-cols-3 gap-2">
              {existingImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`${type}-${i}`}
                  className="h-20 w-full object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              ))}
            </div>
          ) : (
            <div className="w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <img src={existingImages} alt={type} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {!hasExisting && !isEditing && (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
          <span className="material-icons text-5xl text-gray-200 mb-2">image</span>
          <p className="text-sm text-gray-500 font-medium">No images yet</p>
          <p className="text-xs text-gray-400 mt-1">Upload to enhance your profile</p>
        </div>
      )}

      {isEditing && (
        <div className="flex-1">
          <label
            className={`block border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${
              color === "rgb(59, 130, 246)"
                ? "border-blue-300 hover:border-blue-500 hover:bg-blue-50/50"
                : color === "rgb(234, 88, 12)"
                ? "border-orange-300 hover:border-orange-500 hover:bg-orange-50/50"
                : "border-purple-300 hover:border-purple-500 hover:bg-purple-50/50"
            }`}
          >
            <input
              type="file"
              accept="image/*"
              multiple={isMulti}
              className="hidden"
              onChange={(e) => handleFileChange(type, e.target.files)}
            />
            <span className="material-icons text-3xl block mb-1" style={{ color }}>
              cloud_upload
            </span>
            <div className="text-sm font-medium" style={{ color }}>
              Click to select {isMulti ? "(multi)" : ""}
            </div>
          </label>

          {isMulti && imagePreviews[type].length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              {imagePreviews[type].map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`preview-${i}`}
                  className="h-16 w-full object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              ))}
            </div>
          )}
          {!isMulti && imagePreviews[type] && (
            <div className="mt-3 w-full aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
              <img src={imagePreviews[type]} alt="preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {uploadMessages[type] && (
        <div
          className={`text-xs font-semibold rounded-lg p-2 mt-3 ${
            uploadMessages[type].includes("Failed")
              ? "text-red-700 bg-red-50 border border-red-200"
              : uploadMessages[type].includes("uploaded")
              ? "text-green-700 bg-green-50 border border-green-200"
              : "text-gray-700 bg-gray-50 border border-gray-200"
          }`}
        >
          {uploadMessages[type]}
        </div>
      )}

      {isEditing ? (
        <div className="flex gap-2 justify-end mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={resetLocal}
            className="px-3 py-1.5 rounded-lg font-semibold text-xs shadow-sm bg-gray-200 hover:bg-gray-300 text-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => handleUploadImages(type)}
            disabled={uploadingType === type}
            className="px-4 py-1.5 rounded-lg font-semibold text-xs shadow-md text-white transition disabled:opacity-60"
            style={{ background: color }}
          >
            {uploadingType === type ? "Uploading..." : "Save"}
          </button>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setEditingType(type)}
            className="w-full px-3 py-1.5 rounded-lg font-semibold text-xs shadow-md text-white transition"
            style={{ background: color }}
          >
            <span className="material-icons align-middle mr-1" style={{ fontSize: "14px" }}>
              {hasExisting ? "edit" : "upload"}
            </span>
            {hasExisting ? "Edit Images" : "Upload Image"}
          </button>
        </div>
      )}
    </div>
  );
};

const OutletInfoSection = () => {
  const { storeData, setStoreData } = useContext(StoreDataContext);
  const [coverExisting, setCoverExisting] = useState(null);
  const [menuExisting, setMenuExisting] = useState([]);
  const [storeExisting, setStoreExisting] = useState([]);

  // Fetch cover image URL
  useEffect(() => {
    const fetchCoverImage = async () => {
      try {
        if (storeData?.images?.coverImage) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/stores/coverimage/${storeData.images.coverImage}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          setCoverExisting(res.data.data?.url || res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch cover image:", error);
      }
    };
    fetchCoverImage();
  }, [storeData?.images?.coverImage]);

  // Fetch menu images
  useEffect(() => {
    const fetchMenuImages = async () => {
      try {
        if (storeData?.images?.menu) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/stores/menu/${storeData.images.menu}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          const urls = Array.isArray(res.data.data?.image)
            ? res.data.data.image.map((img) => img.url).filter(Boolean)
            : [];
          setMenuExisting(urls);
        }
      } catch (error) {
        console.error("Failed to fetch menu images:", error);
      }
    };
    fetchMenuImages();
  }, [storeData?.images?.menu]);

  // Fetch store images
  useEffect(() => {
    const fetchStoreImages = async () => {
      try {
        if (storeData?.images?.storeImage) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/stores/storeimage/${storeData.images.storeImage}`,
            { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );
          const urls = Array.isArray(res.data.data)
            ? res.data.data
            : [];
          setStoreExisting(urls);
        }
      } catch (error) {
        console.error("Failed to fetch store images:", error);
      }
    };
    fetchStoreImages();
  }, [storeData?.images?.storeImage]);

  const initialAddress = useMemo(
    () =>
      typeof storeData?.address === "object"
        ? storeData.address
        : { building: "", city: "", state: "", zip: "" },
    [storeData?.address]
  );

  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    address: initialAddress,
    phone: storeData?.phone || "",
    activeHours: storeData?.activeHours || "09:00-21:00",
    status: storeData?.status || "online",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const [uploadingType, setUploadingType] = useState(null);
  const [imageFiles, setImageFiles] = useState({ cover: null, menu: [], store: [] });
  const [imagePreviews, setImagePreviews] = useState({ cover: null, menu: [], store: [] });
  const [uploadMessages, setUploadMessages] = useState({ cover: "", menu: "", store: "" });
  const [editingType, setEditingType] = useState(null);

  const handleAddressChange = (e) => {
    setForm((prev) => ({
      ...prev,
      address: { ...prev.address, [e.target.name]: e.target.value },
    }));
  };
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleStatusToggle = () =>
    setForm((prev) => ({ ...prev, status: prev.status === "online" ? "offline" : "online" }));

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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setMsg("Outlet info updated!");
      setEditMode(false);
      setStoreData((prev) => ({ ...prev, ...res.data }));
    } catch {
      setMsg("Failed to update outlet info.");
    }
    setLoading(false);
  };

  const handleFileChange = (key, files) => {
    const arr = Array.from(files || []);
    setImageFiles((p) => ({ ...p, [key]: key === "cover" ? arr[0] : arr }));
    setImagePreviews((p) => ({
      ...p,
      [key]:
        key === "cover"
          ? arr[0]
            ? URL.createObjectURL(arr[0])
            : null
          : arr.map((f) => URL.createObjectURL(f)),
    }));
  };

  const handleUploadImages = async (type) => {
    if (
      (type === "cover" && !imageFiles.cover) ||
      (type === "menu" && imageFiles.menu.length === 0) ||
      (type === "store" && imageFiles.store.length === 0)
    ) {
      setUploadMessages((prev) => ({
        ...prev,
        [type]: `Select at least one image for ${type}.`,
      }));
      return;
    }

    setUploadingType(type);
    setUploadMessages((prev) => ({ ...prev, [type]: "" }));

    const fd = new FormData();
    if (type === "cover" && imageFiles.cover) {
      fd.append("file", imageFiles.cover);
    } else if (type === "menu") {
      imageFiles.menu.forEach((f) => fd.append("files", f));
    } else if (type === "store") {
      imageFiles.store.forEach((f) => fd.append("files", f));
    }

    const uploadUrlMap = {
      cover: `${import.meta.env.VITE_BASE_URL}/stores/upload-cover`,
      menu: `${import.meta.env.VITE_BASE_URL}/stores/upload-menu`,
      store: `${import.meta.env.VITE_BASE_URL}/stores/upload-store`,
    };
    const uploadUrl = uploadUrlMap[type];

    try {
      console.log("type", type);
      const res = await axios.post(uploadUrl, fd, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setStoreData((prev) => ({ ...prev, ...res.data }));
      setUploadMessages((prev) => ({
        ...prev,
        [type]: `${type.charAt(0).toUpperCase() + type.slice(1)} uploaded!`,
      }));
      setImageFiles((prev) => ({ ...prev, [type]: type === "cover" ? null : [] }));
      setImagePreviews((prev) => ({ ...prev, [type]: type === "cover" ? null : [] }));
      setEditingType(null);
    } catch {
      setUploadMessages((prev) => ({
        ...prev,
        [type]: `Failed to upload ${type}.`,
      }));
    }
    setUploadingType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Manage your outlet</p>
            <div className="flex items-center gap-3 mt-1">
              <span className="material-icons text-3xl text-blue-600">store</span>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Outlet Information</h1>
            </div>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-xs font-bold shadow-md border ${
              storeData?.status === "online"
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-rose-50 text-rose-700 border-rose-200"
            }`}
          >
            {storeData?.status === "online" ? "● Online" : "● Offline"}
          </span>
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <span className="material-icons text-blue-600">collections</span>
            <h3 className="text-xl font-bold text-gray-900">Brand Media</h3>
            <p className="ml-auto text-sm text-gray-500">Manage cover, menu & store images</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <MediaCard
              type="cover"
              title="Cover Photo"
              icon="image"
              color="rgb(59, 130, 246)"
              existingImages={coverExisting}
              isMulti={false}
              {...{
                editingType,
                setEditingType,
                imageFiles,
                setImageFiles,
                imagePreviews,
                setImagePreviews,
                uploadMessages,
                uploadingType,
                handleFileChange,
                handleUploadImages,
              }}
            />
            <MediaCard
              type="menu"
              title="Menu Images"
              icon="restaurant_menu"
              color="rgb(234, 88, 12)"
              existingImages={menuExisting}
              isMulti
              {...{
                editingType,
                setEditingType,
                imageFiles,
                setImageFiles,
                imagePreviews,
                setImagePreviews,
                uploadMessages,
                uploadingType,
                handleFileChange,
                handleUploadImages,
              }}
            />
            <MediaCard
              type="store"
              title="Store Images"
              icon="store_mall_directory"
              color="rgb(147, 51, 234)"
              existingImages={storeExisting}
              isMulti
              {...{
                editingType,
                setEditingType,
                imageFiles,
                setImageFiles,
                imagePreviews,
                setImagePreviews,
                uploadMessages,
                uploadingType,
                handleFileChange,
                handleUploadImages,
              }}
            />
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-lg rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
            <span className="material-icons text-blue-600">info</span>
            <h3 className="text-xl font-bold text-gray-900">Store Details</h3>
            <p className="ml-auto text-sm text-gray-500">Manage store information</p>
          </div>

          {!editMode ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {[...FIELD_CONFIG, ...EXTRA_FIELDS].map(({ key, label, icon, fallback }) => {
                  const value =
                    key === "activeHours"
                      ? storeData?.activeHours || fallback
                      : key === "phone"
                      ? storeData?.phone
                      : storeData?.address?.[key];
                  return (
                    <div
                      key={key}
                      className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-gray-50 to-white border border-gray-100"
                    >
                      <span className="material-icons text-base text-blue-600 mt-0.5">{icon}</span>
                      <div>
                        <div className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                          {label}
                        </div>
                        <div className="text-base text-gray-900 font-semibold mt-1">
                          {value || "-"}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <button
                  className="px-6 py-2 rounded-lg font-semibold shadow-md bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white transition"
                  onClick={() => setEditMode(true)}
                >
                  <span className="material-icons align-middle mr-1 text-base">edit</span>
                  Edit Info
                </button>
              </div>
            </>
          ) : (
            <form className="flex flex-col gap-5" onSubmit={handleSubmit} autoComplete="off">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {FIELD_CONFIG.map(({ key, label }) => (
                  <div key={key}>
                    <label className="block font-semibold mb-2 text-gray-700">{label}</label>
                    <input
                      type="text"
                      name={key}
                      value={form.address[key]}
                      onChange={handleAddressChange}
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                ))}
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Active Hours</label>
                  <input
                    type="text"
                    name="activeHours"
                    value={form.activeHours}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="09:00-21:00"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-2 text-gray-700">Store Status</label>
                  <button
                    type="button"
                    className={`w-full px-3 py-2 rounded-lg font-bold shadow-sm border transition ${
                      form.status === "online"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100"
                        : "bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100"
                    }`}
                    onClick={handleStatusToggle}
                  >
                    {form.status === "online" ? "● Online" : "● Offline"}
                  </button>
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  type="button"
                  className="px-6 py-2 rounded-lg font-semibold shadow-md bg-gray-200 hover:bg-gray-300 text-gray-800 transition disabled:opacity-70"
                  onClick={() => setEditMode(false)}
                  disabled={loading}
                >
                  <span className="material-icons align-middle mr-1 text-base">cancel</span>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-lg font-semibold shadow-md bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white transition disabled:opacity-70"
                  disabled={loading}
                >
                  <span className="material-icons align-middle mr-1 text-base">save</span>
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
              {msg && (
                <div
                  className={`text-center font-semibold rounded-lg p-3 ${
                    msg.includes("Failed")
                      ? "text-red-700 bg-red-50 border border-red-200"
                      : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                  }`}
                >
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