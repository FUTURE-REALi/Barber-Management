import express from 'express';
import {body} from 'express-validator';
import {loginUser, logoutUser, registerUser} from '../controllers/user.controller.js';
import {authUser} from '../middlewares/auth.middleware.js';

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

export default router;