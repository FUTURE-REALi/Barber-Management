import express from 'express';
import { addStoreService, getStoreServices, updateStoreService} from '../controllers/storeService.controller.js';
import { authStore } from '../middlewares/auth.middleware.js';
import uploadFileCloud from '../middlewares/cloud.middleware.js';
const router = express.Router();

router.get('/get-store-services/:storeId', getStoreServices);
router.post('/add-store-service', authStore,addStoreService);
router.put('/update-store-service/:serviceId',authStore, updateStoreService);

export default router;