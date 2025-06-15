import express from 'express';
import { getBookings, updateBooking, deleteBooking, getBookingsByUser, getBookingsByStore, getBookingById, insertBooking } from '../controllers/bookings.controller.js';

const router = express.Router();

router.post('/add', insertBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);
router.put('/:id', updateBooking);
router.delete('/:id', deleteBooking);
router.get('/user/:userId', getBookingsByUser);
router.get('/store/:storeId', getBookingsByStore);

export default router;
