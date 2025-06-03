import Booking from "../models/bookings.model.js";

export const createBooking = async (storeId, userId, serviceId, date) => {
    try {
        const booking = new Booking({
            store: storeId,
            user: userId,
            service: serviceId,
            date: date,
            status: 'pending',
        });

        await booking.save();
        return booking;
    } catch (error) {
        throw new Error(`Error creating booking: ${error.message}`);
    }
}