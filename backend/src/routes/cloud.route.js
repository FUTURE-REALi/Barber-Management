import express from 'express';
import uploadFileCloud from '../middlewares/cloud.middleware.js';
import { uploadToCloud } from '../controllers/cloudupload.controller.js';
const router = express.Router();

router.post('/uploadcloud',uploadFileCloud,uploadToCloud);
export default router;