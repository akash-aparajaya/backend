import express from "express";
import {
  startIBVController,
  getIBVStatusController,
  getIBVReportController,
  generateLinkController,
} from "../controllers/ibv.controller.js";

import { validateApiKey } from "../middleware/apikey.middleware.js";

const router = express.Router();

// Create IBV
router.post("/v1/ibv/start", validateApiKey, startIBVController);

// Get IBV Status
router.get("/v1/ibv/status/:requestId", validateApiKey, getIBVStatusController);

// Get IBV Report
router.get("/v1/ibv/report/:requestId", validateApiKey, getIBVReportController);

// Generate Chirp Link Token
router.post("/v1/ibv/link/:requestId", validateApiKey, generateLinkController);

export default router;
