import express from "express";
import { sendSmsController, sendEmailController } from "../controllers/services.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";


const router = express.Router();

/* -------- SMS -------- */
router.post("/send-sms",validateApiKey, sendSmsController);

/* -------- EMAIL -------- */
router.post("/send-email",validateApiKey, sendEmailController);

export default router;