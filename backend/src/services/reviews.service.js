import Review from '../models/reviews.model.js';

export const createReview = async (user,service,reviewText,rating,store,createdAt) => {
    if (!user || !service || !reviewText || !rating || !store) {
        throw new Error('All fields are required');
    }

    const newReview = new Review({
        user,
        service,
        reviewText,
        rating,
        store,
        createdAt: createdAt || Date.now()
    });

    await newReview.save();
    return newReview;
}