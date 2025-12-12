import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Photos = ({ storeData }) => {
  const [photos, setPhotos] = useState({
    storeImages: [],
  });
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      setLoading(true);
      try {
        const images = storeData?.images || {};
        // Fetch store images only
        let storeUrls = [];
        if (images.storeImage) {
          const storeRes = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/stores/storeimage/${images.storeImage._id}`,
            { withCredentials: true }
          );
          storeUrls = storeRes.data.data || [];
        }

        setPhotos({
          storeImages: storeUrls,
        });
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storeData) fetchPhotos();
  }, [storeData]);

  const allImages = photos.storeImages.map(url => ({ url, type: 'Store' }));

  const openLightbox = (image, index) => {
    setCurrentImage(image);
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setCurrentImage(null);
  };

  const goToNext = () => {
    const nextIndex = (currentIndex + 1) % allImages.length;
    setCurrentIndex(nextIndex);
    setCurrentImage(allImages[nextIndex]);
  };

  const goToPrev = () => {
    const prevIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    setCurrentIndex(prevIndex);
    setCurrentImage(allImages[prevIndex]);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading photos...</p>
        </div>
      </div>
    );
  }

  if (allImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6">
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-full p-8 mb-6 shadow-lg">
          <span className="material-icons text-7xl text-orange-400">photo_library</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">No Photos Yet</h3>
        <p className="text-gray-500 text-center max-w-md">
          This store hasn't uploaded any photos yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Store Photos</h2>
          <p className="text-gray-600 font-medium">
            {allImages.length} {allImages.length === 1 ? 'Photo' : 'Photos'} • Explore our store
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2">
          <span className="material-icons">storefront</span>
          {allImages.length}
        </div>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {allImages.map((image, index) => (
          <div
            key={index}
            className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            onClick={() => openLightbox(image, index)}
          >
            {/* Image */}
            <img
              src={image.url}
              alt={`Store ${index + 1}`}
              crossOrigin="anonymous"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Photo Number Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="material-icons align-middle text-sm mr-1">storefront</span>
              Photo {index + 1}
            </div>
            
            {/* Expand Icon */}
            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="material-icons text-gray-800">zoom_in</span>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && currentImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            className="absolute top-6 right-6 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all shadow-2xl z-10"
            onClick={closeLightbox}
          >
            <span className="material-icons text-2xl">close</span>
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 bg-white/10 backdrop-blur-md text-white px-5 py-3 rounded-full font-bold shadow-2xl z-10">
            {currentIndex + 1} / {allImages.length}
          </div>

          {/* Store Badge */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-10 flex items-center gap-2">
            <span className="material-icons">storefront</span>
            Store Photos
          </div>

          {/* Navigation Buttons */}
          {allImages.length > 1 && (
            <>
              <button
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all shadow-2xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrev();
                }}
              >
                <span className="material-icons text-3xl">chevron_left</span>
              </button>
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-4 rounded-full transition-all shadow-2xl z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
              >
                <span className="material-icons text-3xl">chevron_right</span>
              </button>
            </>
          )}

          {/* Main Image */}
          <div className="relative max-w-6xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={currentImage.url}
              alt="Store"
              crossOrigin="anonymous"
              className="w-full h-full object-contain rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;