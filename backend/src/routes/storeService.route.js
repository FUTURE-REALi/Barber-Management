import express from 'express';
import { addStoreService, getStoreServices} from '../controllers/storeService.controller.js';
const router = express.Router();

router.get('/get-store-services/:storeId', getStoreServices);
router.post('/add-store-service', addStoreService);

export default router;