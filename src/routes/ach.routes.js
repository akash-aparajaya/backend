import express from "express";
import {
  createACHCustomerController,
  createACHPaymentMethodController,
  createACHPaymentController,
  refundACHPaymentController,
  createDisbursementController,
} from "../controllers/ach.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";

const router = express.Router();

/* ==========================================
   ACH ROUTES
========================================== */

// Create Customer
router.post("/v1/ach/customer", validateApiKey, createACHCustomerController);

// Create Payment Method - Bank Account / Card
router.post(
  "/v1/ach/payment-method",
  validateApiKey,
  createACHPaymentMethodController,
);

// Create Payment -Collect Money
router.post("/v1/ach/payment", validateApiKey, createACHPaymentController);

// Refund Payment
router.post(
  "/v1/ach/payment/:paymentId/refund",
  validateApiKey,
  refundACHPaymentController,
);

// Create Disbursement - Send Money
router.post(
  "/v1/ach/disbursement",
  validateApiKey,
  createDisbursementController,
);

export default router;
