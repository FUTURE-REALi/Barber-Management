import express from "express";
import { body} from "express-validator";
import {loginStore, registerStore} from "../controllers/store.controller.js";

const router = express.Router();

router.post('/register', [
    body('storename').not().isEmpty().withMessage('Storename is required'),
    body('ownername').not().isEmpty().withMessage('Ownername is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({min: 6}).withMessage('Password must be at least 6 characters long'),
    body('address').not().isEmpty().withMessage('Address is required'),
    body('phone').matches(/^\d{10}$/).withMessage('Please provide a valid 10-digit phone number')
],
registerStore);

router.post('/login', [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],
loginStore);

export default router;