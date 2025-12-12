import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Reviews = ({ storeData }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, reviewText: '', serviceId: '' });
  const [submitting, setSubmitting] = useState(false);

  const storeId = storeData?._id;
  const services = storeData?.services || [];

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/stores/reviews/${storeId}`,
          { withCredentials: true }
        );
        setReviews(response.data.ratings || []);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    if (storeId) fetchReviews();
  }, [storeId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.serviceId || !newReview.reviewText) {
      alert('Please select a service and write a review');
      return;
    }

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/stores/reviews/${storeId}/${newReview.serviceId}`,
        { rating: newReview.rating, reviewText: newReview.reviewText },
        { withCredentials: true, headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      
      setReviews([response.data.rating, ...reviews]);
      setNewReview({ rating: 5, reviewText: '', serviceId: '' });
      setShowReviewForm(false);
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-200 border-t-orange-600 mb-4"></div>
          <p className="text-gray-600 font-semibold">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-gray-900 mb-2">Customer Reviews</h2>
          <p className="text-gray-600 font-medium">
            {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
          </p>
        </div>
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <span className="material-icons">rate_review</span>
          Write Review
        </button>
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 shadow-lg">
          <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
            <span className="material-icons text-orange-600">edit_note</span>
            Write Your Review
          </h3>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Service Select */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Select Service *</label>
              <select
                value={newReview.serviceId}
                onChange={(e) => setNewReview({ ...newReview, serviceId: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all font-medium"
                required
              >
                <option value="">Choose a service...</option>
                {services.map((ss) => (
                  <option key={ss._id} value={ss.service?._id}>
                    {ss.service?.name || 'Unknown Service'}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Rating *</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-3xl transition-all transform hover:scale-110 ${
                      star <= newReview.rating ? 'text-yellow-500' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Your Review *</label>
              <textarea
                value={newReview.reviewText}
                onChange={(e) => setNewReview({ ...newReview, reviewText: e.target.value })}
                rows="4"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all resize-none"
                placeholder="Share your experience..."
                required
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-full p-8 mb-6 shadow-lg">
            <span className="material-icons text-7xl text-orange-400">rate_review</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Reviews Yet</h3>
          <p className="text-gray-500 text-center max-w-md mb-6">
            Be the first to share your experience!
          </p>
          <button
            onClick={() => setShowReviewForm(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            Write First Review
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-orange-100 to-red-100 p-3 rounded-full">
                    <span className="material-icons text-orange-600">person</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.user?.username || 'Anonymous'}</h4>
                    <p className="text-sm text-gray-500">{review.service?.name || 'Service'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xl ${i < review.rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.review}</p>
              <p className="text-xs text-gray-400 mt-3">
                {new Date(review.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;