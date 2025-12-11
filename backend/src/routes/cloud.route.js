import express from 'express';
import { uploadMultipleFileCloud } from '../middlewares/cloud.middleware.js';
import { uploadMultipleFileToCloud} from '../controllers/cloud.controller.js';
const router = express.Router();

router.post('/uploadcloud',uploadMultipleFileCloud,uploadMultipleFileToCloud);
export default router;