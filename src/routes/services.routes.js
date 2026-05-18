import express from "express";
import { sendSmsController, sendEmailController,getAllProvidersController,getAllServicesController } from "../controllers/services.controller.js";
import { validateApiKey } from "../middleware/apikey.middleware.js";


const router = express.Router();
/* -------- All Services -------- */
router.get("/get-all-services", getAllServicesController);

/* -------- All providers -------- */
router.get("/get-all-providers", getAllProvidersController);

/* -------- SMS -------- */
router.post("/send-sms",validateApiKey, sendSmsController);

/* -------- EMAIL -------- */
router.post("/send-email",validateApiKey, sendEmailController);

export default router;