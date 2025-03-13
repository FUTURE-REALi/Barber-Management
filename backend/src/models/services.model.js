import mongoose, { Schema } from "mongoose";

const serviceSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
    },
    stores: [{
        type: Schema.Types.ObjectId,
        ref: "Store",
    }]
});

const Service = mongoose.model("Service", serviceSchema);
export default Service;

