import express from "express";
import { getServices, insertService } from "../controllers/services.controller.js";
import { uploadMultipleFileCloud } from "../middlewares/cloud.middleware.js";

const router = express.Router();

router.get('/get-services',getServices);
router.post('/add-service',uploadMultipleFileCloud,insertService);

export default router;