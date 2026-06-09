import express from "express";
import * as apiDocsController from "../controllers/apiDocs.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (no auth required)
router.get("/public/services", apiDocsController.getServicesWithProviders);
router.get("/public/service/:serviceId", apiDocsController.getApiDocsByService);
router.get("/public/:id", apiDocsController.getApiDocById);

// Admin routes (with authentication)
router.get("/", verifyToken, apiDocsController.getAllApiDocs);
router.get("/:id", verifyToken, apiDocsController.getApiDocById);
router.post("/", verifyToken, apiDocsController.createApiDoc);
router.put("/:id", verifyToken, apiDocsController.updateApiDoc);
router.delete("/:id", verifyToken, apiDocsController.deleteApiDoc);

export default router;