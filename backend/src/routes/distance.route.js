import express from 'express';
import { getDistanceFromAddresses } from '../controllers/distance.controllers.js';
const router = express.Router();

router.post('/get-distance', getDistanceFromAddresses);

export default router;