import express from 'express';
import uploadFileCloud from '../middlewares/cloud.middleware.js';
import { uploadToCloud } from '../controllers/cloud.controller.js';
const router = express.Router();

router.post('/uploadcloud',uploadFileCloud,uploadToCloud);
export default router;