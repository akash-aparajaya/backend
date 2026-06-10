import express from "express";
import {
  createPaymentGatewayCustomerController,
  createPaymentGatewayPaymentMethodController,
  createPaymentGatewayPaymentController,
  getPaymentGatewayPaymentController,
  refundPaymentGatewayPaymentController,
} from "../controllers/paymentGateway.controller.js";

import { validateApiKey } from "../middleware/apikey.middleware.js";

const router = express.Router();

/* ==========================================
   PAYMENT GATEWAY ROUTES
========================================== */

// Create Customer
router.post(
  "/v1/payment-gateway/customer",
  validateApiKey,
  createPaymentGatewayCustomerController,
);

// Create Payment Method - Card
router.post(
  "/v1/payment-gateway/payment-method",
  validateApiKey,
  createPaymentGatewayPaymentMethodController,
);

// Create Payment
router.post(
  "/v1/payment-gateway/payment",
  validateApiKey,
  createPaymentGatewayPaymentController,
);

// Get Payment Status
router.get(
  "/v1/payment-gateway/payment/:paymentId",
  validateApiKey,
  getPaymentGatewayPaymentController,
);

// Refund Payment
router.post(
  "/v1/payment-gateway/payment/:paymentId/refund",
  validateApiKey,
  refundPaymentGatewayPaymentController,
);

export default router;
