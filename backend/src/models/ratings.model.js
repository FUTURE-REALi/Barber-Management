import mongoose, { Schema } from "mongoose";

const ratingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: "Service",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 500
    },
    store: {
        type: Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

ratingSchema.methods.getAverageRatingforStore = async function(storeId) {
    const ratings = await this.model("Rating").find({ store: storeId });
    if (ratings.length === 0) return 0;

    const total = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return total / ratings.length;
}
ratingSchema.methods.getAverageRatingForEachServiceForStore = async function(storeId) {
    const ratings = await this.model("Rating").find({ store: storeId }).populate('service');
    if (ratings.length === 0) return {};

    const serviceRatings = {};
    ratings.forEach(rating => {
        if (!serviceRatings[rating.service.name]) {
            serviceRatings[rating.service.name] = { total: 0, count: 0 };
        }
        serviceRatings[rating.service.name].total += rating.rating;
        serviceRatings[rating.service.name].count += 1;
    });

    for (const service in serviceRatings) {
        serviceRatings[service].average = serviceRatings[service].total / serviceRatings[service].count;
    }

    return serviceRatings;
}

ratingSchema.methods.getRatingsByUser = async function(userId) {
    return await this.model("Rating").find({ user: userId }).populate('service store');
}

const Rating = mongoose.model("Rating", ratingSchema);
export default Rating;