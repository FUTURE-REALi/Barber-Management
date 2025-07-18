import Booking from "../models/bookings.model.js";
import storeModel from "../models/store.model.js";
import userModel from "../models/user.model.js";
import { createBooking } from "../services/bookings.service.js";

export const insertBooking = async (req, res, next) => {
    const { store, user, service, date, status, paymentId, totalPrice } = req.body;
    console.log("Booking request received:", req.body);

    if (!store || !user || !service || !date || !status || !paymentId || !totalPrice) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        const booking = await createBooking(store, user, service, date, paymentId, totalPrice , status);
        const bookinguser = await userModel.findById(user).populate('bookings');
        const bookedstore = await storeModel.findById(store).populate('bookings');
        if (!bookinguser) {
            return res.status(404).json({ error: "User not found" });
        }
        if (!bookedstore) {
            return res.status(404).json({ error: "Booking not found" });
        }

        bookinguser.bookings.push(booking._id);
        bookedstore.bookings.push(booking._id);
        await bookinguser.save();
        await bookedstore.save();

        res.status(201).json(booking);
    } catch (error) {
        console.log("Error creating booking:", error);
        return res.status(500).json({ error: error.message });
    }
}

export const getBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find().populate('store user service');
        res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getBookingById = async (req, res, next) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findById(id).populate('store user service');
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const updateBooking = async (req, res, next) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: "Status is required" });
    }

    try {
        const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true }).populate('store user service');
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json(booking);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const deleteBooking = async (req, res, next) => {
    const { id } = req.params;

    try {
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({ error: "Booking not found" });
        }
        res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getBookingsByUser = async (req, res, next) => {
    const { userId } = req.params;

    try {
        const bookings = await Booking.find({ user: userId }).populate('user')
            .populate({
                path: 'service',
                populate: {
                    path: 'service',
                    model: 'Service'
                }
            });
        if (!bookings.length) {
            return res.status(404).json({ error: "No bookings found for this user" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getBookingsByStore = async (req, res, next) => {
    const { storeId } = req.params;

    try {
        const bookings = await Booking.find({ store: storeId }).populate('user service');
        if (!bookings.length) {
            return res.status(404).json({ error: "No bookings found for this store" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}


