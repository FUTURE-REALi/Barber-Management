import express from "express";
import { body} from "express-validator";
import {createStoreReview, getAllStores, getStore, getStoreAverageRating, getStoreBookings, getStorebyServices, getStoreInsights, getStoreProfile, getStoreReviews, includedServices, loginStore, logoutStore, registerStore, updateBookingStatus, updateStore, getPayoutStats} from "../controllers/store.controller.js";
import { authStore, authUser } from "../middlewares/auth.middleware.js";
import { addStoreService } from "../controllers/storeService.controller.js";

const router = express.Router();

router.post('/register', [
    body('storename').not().isEmpty().withMessage('Storename is required'),
    body('ownername').not().isEmpty().withMessage('Ownername is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('address').not().isEmpty().withMessage('Address is required'),
    body('phone').matches(/^\d{10}$/).withMessage('Please provide a valid 10-digit phone number'),
],
registerStore);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
loginStore);

router.get('/logout', authStore,logoutStore);

router.post('/add-service', authStore, [
    body('name').not().isEmpty().withMessage('Name is required'),
    body('description').not().isEmpty().withMessage('Description is required'),
    body('price').not().isEmpty().withMessage('Price is required'),
    body('duration').not().isEmpty().withMessage('Duration is required'),
], includedServices);
router.get('/getstoreprofile', authStore,getStoreProfile);
router.get('/get-store/:storeId', getStore);
router.get('/getallstores', getAllStores);
router.get('/getstorebyservice', getStorebyServices);
router.put('/update-store', authStore,updateStore);
router.get('/:storeId/reviews',getStoreReviews);
router.post('/:storeId/:serviceId/reviews', authUser, [
    body('reviewText').not().isEmpty().withMessage('Review is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
],createStoreReview);
router.get('/average-rating/:storeId', getStoreAverageRating);
router.post('/add-store-service', authStore, addStoreService);
router.get('/getstorebookings',authStore,getStoreBookings);
router.put('/updatebookingstatus/:bookingId', authStore, updateBookingStatus);
router.get('/insights/:storeId', authStore, getStoreInsights);
router.get('/payout-stats/:storeId', getPayoutStats);
export default router;