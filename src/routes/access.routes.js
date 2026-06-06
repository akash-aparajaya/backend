import express from "express";
import { validateApiKey } from "../middleware/apikey.middleware.js";
import {
  sendSmsController,
  sendEmailController,
  sendWhatsAppController,
} from "../controllers/access.controller.js";
const router = express.Router();

/* -------- SMS -------- */
router.post("/send-sms", validateApiKey, sendSmsController);

/* -------- EMAIL -------- */
router.post("/send-email", validateApiKey, sendEmailController);

/* -------- WHATSAPP -------- */
router.post("/send-whatsapp", validateApiKey, sendWhatsAppController);

export default router;
