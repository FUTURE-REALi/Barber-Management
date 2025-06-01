import express from "express";
import { getServices, insertService } from "../controllers/services.controller.js";

const router = express.Router();

router.get('/get-services', getServices);
router.post('/add-service',insertService);

export default router;