import Rating from "../models/ratings.model.js";

export const createRating = async (user,service,review,rating,store,createdAt) => {
    if (!user || !service || !review || !rating || !store) {
        throw new Error('All fields are required');
    }

    const newRating = new Rating({
        user,
        service,
        review,
        rating,
        store,
        createdAt: createdAt || Date.now()
    });

    await newRating.save();
    return newRating;
}