import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema({
    store:{
        type: Schema.Types.ObjectId,
        ref: 'Store',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'StoreService',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slot: {
        type: String,
        required: true
    },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
