import express from 'express';
import {body} from 'express-validator';
import {getUserProfile, loginUser, logoutUser, registerUser, updateUserAddress} from '../controllers/user.controller.js';
import {authUser} from '../middlewares/auth.middleware.js';
import { getBookingsByUser } from '../controllers/bookings.controller.js';

const router = express.Router();

router.post('/register', [
    body('fullname').not().isEmpty().withMessage('Fullname is required'),
    body('username').not().isEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long')
],
registerUser);

router.post('/login', [
    body('username').optional().not().isEmpty().withMessage('Username is required if email is not provided'),
    body('email').optional().isEmail().withMessage('Please provide a valid email if username is not provided'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
loginUser);

router.get('/logout', authUser,logoutUser);

router.get('/profile', authUser, getUserProfile);

router.put('/update-location/:id', authUser, updateUserAddress);

router.get('/bookings/:id',authUser, getBookingsByUser);

export default router;