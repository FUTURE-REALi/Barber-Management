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
app.use(cors());
app.use(cookieParser());


app.get('/', (req, res) => {
    res.send('Hello World!');
});

import userRoute from './src/routes/user.route.js';
import storeRoute from './src/routes/store.route.js';
import serviceRoute from './src/routes/services.route.js';

app.use('/users', userRoute);
app.use('/stores', storeRoute);
app.use('/services', serviceRoute);

export default app;
