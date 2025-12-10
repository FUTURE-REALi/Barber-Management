import express from "express";
import { getServices, insertService } from "../controllers/services.controller.js";
import uploadFileCloud from "../middlewares/cloud.middleware.js";

const router = express.Router();

router.get('/get-services',getServices);
router.post('/add-service',uploadFileCloud,insertService);

export default router;