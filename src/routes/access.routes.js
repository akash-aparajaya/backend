import express from "express";
import { validateApiKey } from "../middleware/apikey.middleware.js";
import {
  sendSmsController,
  sendEmailController,
  sendWhatsAppController,
  sendIBVController,
  sendCreditScoreController,
  sendPaymentGatewayController,
  sendACHController,
} from "../controllers/access.controller.js";
const router = express.Router();

/* -------- SMS -------- */
router.post("/send-sms", validateApiKey, sendSmsController);

/* -------- EMAIL -------- */
router.post("/send-email", validateApiKey, sendEmailController);

/* -------- WHATSAPP -------- */
router.post("/send-whatsapp", validateApiKey, sendWhatsAppController);

/* -------- IBV -------- */
router.post("/send-ibv", validateApiKey, sendIBVController);

/* -------- CREDIT SCORE -------- */
router.post("/send-credit-score", validateApiKey, sendCreditScoreController);

/* -------- PAYMENT GATEWAY -------- */
router.post("/send-payment", validateApiKey, sendPaymentGatewayController);

/* -------- ACH -------- */
router.post("/send-ach", validateApiKey, sendACHController);

/* -------- OTHERS -------- */
router.post("/send-others", validateApiKey);

export default router;
