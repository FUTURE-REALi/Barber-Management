import React, { use, useEffect, useState } from 'react';
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
          setReviews(res.data.reviews || []);
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
    console.log("button clicked");
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/stores/${storeId}/${serviceId}/reviews`, 
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
        setReviews([res.data.review, ...reviews]);
        setReviewInput('');
        setRatingInput(5);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      alert('Failed to submit review. Please try again later.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white p-4 w-full rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Reviews</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full max-w-md mb-6">
        <textarea
          className="border rounded p-2 w-full"
          placeholder="Write your review..."
          value={reviewInput}
          onChange={e => setReviewInput(e.target.value)}
          rows={3}
          required
        />
        <div className="flex items-center gap-2">
          <label htmlFor="rating" className="font-medium">Rating:</label>
          <select
            id="rating"
            className="border rounded px-2 py-1"
            value={ratingInput}
            onChange={e => setRatingInput(Number(e.target.value))}
          >
            {[5,4,3,2,1].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <select
            id="service"
            className="border rounded px-2 py-1"
            value={serviceId}
            onChange={e => setServiceId(e.target.value)}
          >
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name}
              </option>
            ))}
          </select>
          <button
            type="submit" 
            className="ml-auto bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            disabled={loading}
            onSubmit={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="w-full max-w-md space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="border rounded p-3 bg-gray-50">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{review.user || 'Anonymous'}</span>
                <span className="text-yellow-500">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span>
              </div>
              <p className="text-gray-800">{review.review}</p>
              <div className="text-xs text-gray-400 mt-1">{review.createdAt ? new Date(review.createdAt).toLocaleString() : ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reviews;