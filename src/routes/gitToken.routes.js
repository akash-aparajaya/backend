import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import {
  createApiKeyController,
  regenerateApiKeyController,
  getApiKeysController,
  deleteApiKeyController,
} from "../controllers/gitToken.controller.js";
const router = express.Router();

/* -------- CREATE API KEY -------- */
router.post(
  "/create-api-key",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  createApiKeyController,
);

//* -------- GET API KEYS -------- */
router.get(
  "/get-api-keys",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getApiKeysController,
);

/* -------- REGENERATE API KEY -------- */
router.patch(
  "/regenerate-api-key/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  regenerateApiKeyController,
);

/* -------- DELETE API KEY -------- */
router.delete(
  "/delete-api-key/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  deleteApiKeyController,
);

export default router;
