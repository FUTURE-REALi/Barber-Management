import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './src/config/db.js';
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigin = 'http://localhost:5173';

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

import userRoute from './src/routes/user.route.js';
import storeRoute from './src/routes/store.route.js';
import serviceRoute from './src/routes/services.route.js';
import storeServiceRoute from './src/routes/storeService.route.js';
import bookingRoute from './src/routes/bookings.route.js';
import orderCartRoute from './src/routes/orderCart.route.js';
import paymentRoute from './src/routes/payment.route.js';
import promocodeRoutes from "./src/routes/promocode.route.js";
import campaignRoutes from "./src/routes/campaign.route.js";

app.use('/users', userRoute);
app.use('/stores', storeRoute);
app.use('/services', serviceRoute);
app.use('/store-services',storeServiceRoute);
app.use('/bookings',bookingRoute);
app.use('/order-cart', orderCartRoute);
app.use('/payment',paymentRoute);
app.use("/promocode", promocodeRoutes);
app.use("/campaign", campaignRoutes);

export default app;
