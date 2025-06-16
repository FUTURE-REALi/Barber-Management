import express from "express";
import { createPromocode } from "../controllers/promocode.controller.js";
import { authStore } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/create", authStore, createPromocode);

export default router;