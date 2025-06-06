import mongoose, { Schema } from "mongoose";

const orderCartSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    store: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true
    },
    items: [{
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "StoreService",
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    timestamps: true
});

const OrderCart = mongoose.model("OrderCart", orderCartSchema);