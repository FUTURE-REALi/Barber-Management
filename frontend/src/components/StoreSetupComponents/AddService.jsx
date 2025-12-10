import React, { useState } from 'react';

const AddService = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    serviceName: '',
    serviceDescription: '',
    price: '',
    duration: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Validation
    if (!form.serviceName.trim()) {
      alert('Service name is required');
      return;
    }
    if (!form.price || form.price <= 0) {
      alert('Valid price is required');
      return;
    }
    if (!form.duration || form.duration <= 0) {
      alert('Valid duration is required');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('name', form.serviceName);
    formData.append('description', form.serviceDescription);
    formData.append('price', Number(form.price));
    formData.append('duration', Number(form.duration));
    if (form.image) {
      formData.append('files', form.image);
    }

    try {
      await onSubmit(e, formData);
    } catch (error) {
      console.error('Error submitting service:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeImage = () => {
    setForm({ ...form, image: null });
    setImagePreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="max-w-lg w-full bg-white shadow-2xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Add New Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <span className="material-icons text-2xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <span className="flex items-center gap-2">
                <span className="material-icons text-lg">image</span>
                Service Image
              </span>
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg border-2 border-blue-300"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                >
                  <span className="material-icons">delete</span>
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <span className="material-icons text-4xl text-gray-400 mb-2">cloud_upload</span>
                  <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            )}
          </div>

          {/* Service Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="serviceName">
              <span className="flex items-center gap-2">
                <span className="material-icons text-base">business_center</span>
                Service Name
              </span>
            </label>
            <input
              type="text"
              id="serviceName"
              name="serviceName"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="e.g., Haircut, Beard Trim, Massage"
              value={form.serviceName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="serviceDescription">
              <span className="flex items-center gap-2">
                <span className="material-icons text-base">description</span>
                Description
              </span>
            </label>
            <textarea
              id="serviceDescription"
              name="serviceDescription"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
              placeholder="Describe the service details, benefits, or what's included"
              value={form.serviceDescription}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Price and Duration Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="price">
                <span className="flex items-center gap-2">
                  <span className="material-icons text-base">currency_rupee</span>
                  Price
                </span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="0"
                value={form.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="duration">
                <span className="flex items-center gap-2">
                  <span className="material-icons text-base">schedule</span>
                  Duration
                </span>
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="minutes"
                value={form.duration}
                onChange={handleChange}
                min="1"
                max="480"
                required
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              type="button"
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition font-semibold flex items-center justify-center gap-2"
              onClick={onClose}
            >
              <span className="material-icons text-base">close</span>
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                  Adding...
                </>
              ) : (
                <>
                  <span className="material-icons text-base">add_circle</span>
                  Add Service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;