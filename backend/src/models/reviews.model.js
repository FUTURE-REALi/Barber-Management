import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
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
    reviewText: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Schema.Types.ObjectId,
        ref: "Rating",
        required: true
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

reviewSchema.methods.getReviewsForStore = async function(storeId) {
    const reviews = await this.model("Review").find({ store: storeId }).populate('user').populate('service');
    return reviews;
}
reviewSchema.methods.getReviewsForService = async function(serviceId) {
    const reviews = await this.model("Review").find({ service: serviceId }).populate('user');
    return reviews;
}
const Review = mongoose.model("Review", reviewSchema);
export default Review;