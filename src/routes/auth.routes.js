import express from "express";
import {
  login,
  createSuperAdmin,
  refreshAccessToken,
  logout
} from "../controllers/auth.controller.js";

import { createAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* -------- ROUTES -------- */
router.post("/create-super-admin", createSuperAdmin);

/* -------- LOGIN -------- */
router.post("/login", login);

/* -------- REFRESH TOKEN -------- */
router.post("/refresh-token", refreshAccessToken);

/* -------- logout -------- */
router.get("/logout", logout);

/* -------- ADMIN -------- */
router.post(
  "/create-admin",
  verifyToken,
  allowRoles("SUPER_ADMIN"),
  createAdmin
);

export default router;
