import express from "express";

import {
  createApiKeyController,
  regenerateApiKeyController,
  getApiKeysController,
  deleteApiKeyController,
} from "../controllers/gitToken.controller.js";

import { validateApiKey } from "../middleware/apikey.middleware.js";


const router = express.Router();

/* -------- CREATE API KEY -------- */
router.post("/create-api-key", createApiKeyController);

//* -------- GET API KEYS -------- */
router.get("/get-api-keys", getApiKeysController);

/* -------- REGENERATE API KEY -------- */
router.patch(
  "/regenerate-api-key/:id",
  validateApiKey,
  regenerateApiKeyController,
);

/* -------- DELETE API KEY -------- */
router.delete("/delete-api-key/:id", validateApiKey, deleteApiKeyController);

export default router;
