import express from "express";
import {
  sendSmsController,
  sendEmailController,
  getProvidersByServiceIdController,
  getAllServicesController,
  getProviderByIdController,
  createProviderController,
  updateProviderController,
  deleteProviderController,
  getProvidersByEnvironmentIdController,
  unlockServiceController,

  revealProviderCredentials
} from "../controllers/services.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();
/* -------- All Services -------- */
router.get("/get-all-services", getAllServicesController);

/* -------- get providers by environment id -------- */
router.get(
  "/get-all-providers-by-environment/:id",
  getProvidersByEnvironmentIdController,
);

/* -------- get providers by service id -------- */
router.get(
  "/get-providers-by-service-id/:id",
  getProvidersByServiceIdController,
);

/* -------- get provider by id -------- */
router.get("/get-provider-by-id/:id", getProviderByIdController);

/* -------- create provider based on project-services -------- */
router.post("/create-provider", createProviderController);

/* -------- update provider -------- */
router.patch("/update-provider/:id", updateProviderController);

/* -------- delete provider -------- */
router.patch("/delete-provider/:id", deleteProviderController);

router.get("/reveal-provider-credentials/:id", revealProviderCredentials);

/* -------- SMS -------- */
router.post("/send-sms", validateApiKey, sendSmsController);

/* -------- EMAIL -------- */
router.post("/send-email", validateApiKey, sendEmailController);

// /* -------- WHATSAPP -------- */
// router.post("/send-whatsapp", validateApiKey, sendWhatsAppController);

// /* -------- Unmask- service-------- */
router.post(
  "/unlock-service",
  verifyToken,
  unlockServiceController
);

export default router;
