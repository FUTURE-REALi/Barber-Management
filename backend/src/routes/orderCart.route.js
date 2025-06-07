import express from 'express';
import { createOrderCart, deleteOrderCart, getOrderCart, updateOrderCart } from '../controllers/orderCart.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';
const router = express.Router();

router.post('/create',authUser,createOrderCart);
router.delete('/delete/:id', authUser, deleteOrderCart);
router.get('/:userId', authUser, getOrderCart); 
router.put('/update/:id', authUser, updateOrderCart);


export default router;