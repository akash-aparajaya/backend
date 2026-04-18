import express from "express";
import { sendSmsController } from "../controllers/sms.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";


const router = express.Router();

// POST /api/sms/send
router.post("/send-sms",validateApiKey, sendSmsController);

export default router;