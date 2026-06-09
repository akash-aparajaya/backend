import express from "express";
import {
  createACHCustomerController,
  createACHPaymentMethodController,
  createACHPaymentController,
  getACHPaymentController,
  refundACHPaymentController,
} from "../controllers/ach.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";

const router = express.Router();

/* ==========================================
   ACH ROUTES
========================================== */

// Create Customer
router.post("/v1/ach/customer", validateApiKey, createACHCustomerController);

// Create Payment Method
router.post(
  "/v1/ach/payment-method",
  validateApiKey,
  createACHPaymentMethodController,
);

// Create Payment
router.post("/v1/ach/payment", validateApiKey, createACHPaymentController);

// Get Payment Status
router.get(
  "/v1/ach/payment/:paymentId",
  validateApiKey,
  getACHPaymentController,
);

// Refund Payment
router.post(
  "/v1/ach/payment/:paymentId/refund",
  validateApiKey,
  refundACHPaymentController,
);

export default router;
