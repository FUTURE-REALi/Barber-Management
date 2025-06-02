import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Reviews = ({ storeId, services }) => {
  const [reviews, setReviews] = useState([]);
  const [reviewInput, setReviewInput] = useState('');
  const [ratingInput, setRatingInput] = useState(5);
  const [loading, setLoading] = useState(true);
  const [serviceId, setServiceId] = useState(services.length > 0 ? services[0]._id : '');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/stores/${storeId}/reviews`);
        if (res.status === 200) {
          setReviews(res.data.ratings || []);
        }
      } catch (err) {
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    if (storeId) fetchReviews();
  }, [storeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reviewInput.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to submit a review.');
      navigate('/login');
      return;
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/stores/${storeId}/${serviceId}/reviews`,
        {
          reviewText: reviewInput,
          rating: ratingInput,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      if (res.status === 201) {
        setReviews([res.data.rating, ...reviews]);
        setReviewInput('');
        setRatingInput(5);
      }
    } catch (err) {
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white">
      {/* Write Review */}
      <div className="border-b pb-6 mb-6">
        <h2 className="text-2xl font-bold mb-2">Write a Review</h2>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2 items-start md:items-end">
          <textarea
            className="border rounded p-2 w-full md:w-2/3"
            placeholder="Write your review..."
            value={reviewInput}
            onChange={e => setReviewInput(e.target.value)}
            rows={2}
            required
          />
          <div className="flex flex-col gap-2 md:ml-4">
            <select
              className="border rounded px-2 py-1"
              value={ratingInput}
              onChange={e => setRatingInput(Number(e.target.value))}
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num}★</option>
              ))}
            </select>
            <select
              className="border rounded px-2 py-1"
              value={serviceId}
              onChange={e => setServiceId(e.target.value)}
            >
              {services.map(storeService => (
                <option key={storeService._id} value={storeService._id}>
                  {storeService.service?.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600 mt-1"
              disabled={loading}
            >
              Submit
            </button>
          </div>
        </form>
      </div>

      {/* Reviews List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">All Reviews</h2>
          <div className="flex items-center gap-2 text-gray-600">
            <span className="material-icons">sort</span>
            <span>Newest First</span>
          </div>
        </div>
        {loading ? (
          <p>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-8">
            {reviews.map((review, idx) => (
              <div key={idx} className="flex flex-row items-start gap-4 border-b pb-8">
                {/* Avatar */}
                <div>
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl text-gray-400">
                    <span className="material-icons">person</span>
                  </div>
                </div>
                {/* Review Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{review.user?.username || review.user?.fullname || 'Anonymous'}</span>
                    <span className="text-gray-500 text-sm">0 reviews • 0 Followers</span>
                    <button className="ml-auto border border-red-300 text-red-500 px-4 py-1 rounded-lg hover:bg-red-50">Follow</button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-semibold flex items-center">
                      {review.rating} <span className="ml-1 text-xs">★</span>
                    </span>
                    <span className="bg-gray-100 text-green-900 px-2 py-1 rounded text-xs font-semibold ml-2">DINING</span>
                    <span className="text-gray-400 text-xs ml-2">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</span>
                  </div>
                  <div className="mt-2 text-base text-gray-800">{review.review}</div>
                  <div className="text-gray-500 text-sm mt-2">0 Votes for helpful, 0 Comments</div>
                  <div className="flex items-center gap-6 mt-2 text-gray-600">
                    <button className="flex items-center gap-1 hover:text-red-500">
                      <span className="material-icons text-base">thumb_up_off_alt</span> Helpful
                    </button>
                    <button className="flex items-center gap-1 hover:text-blue-500">
                      <span className="material-icons text-base">chat_bubble_outline</span> Comment
                    </button>
                    <button className="flex items-center gap-1 hover:text-gray-800">
                      <span className="material-icons text-base">share</span> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;