import express from "express";
import { createCampaign } from "../controllers/campaign.controller.js";
import { authStore } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", authStore, createCampaign);

export default router;