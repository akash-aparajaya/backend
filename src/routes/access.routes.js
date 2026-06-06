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

/* ------------------------ Messaging Routes ------------------------ */

// SMS
router.post("/v1/messages/sms", validateApiKey, sendSmsController);

// Email
router.post("/v1/messages/email", validateApiKey, sendEmailController);

// Whatsapp
router.post("/v1/messages/whatsapp", validateApiKey, sendWhatsAppController);

/* ------------------------ Verification Routes ------------------------ */

// IBV
router.post("/v1/verifications/ibv", validateApiKey, sendIBVController);

// Credit Score
router.post(
  "/v1/verifications/credit-score",
  validateApiKey,
  sendCreditScoreController,
);

/* ------------------------ Payment Routes ------------------------ */

// Payment Gateway
router.post(
  "/v1/payment/gateway",
  validateApiKey,
  sendPaymentGatewayController,
);

// ACH
router.post("/v1/payment/ach", validateApiKey, sendACHController);

// Send others
router.post("/v1/send-others", validateApiKey);

export default router;
