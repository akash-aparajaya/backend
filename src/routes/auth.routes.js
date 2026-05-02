import express from "express";
import {
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import { createAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* -------- LOGIN -------- */
router.post("/login", login);

/* -------- REFRESH TOKEN -------- */
router.post("/refresh-token", refreshAccessToken);

/* -------- FORGOT PASSWORD -------- */
router.post("/forgotPassword", forgotPassword);

/* -------- RESET PASSWORD -------- */
router.post("/resetPassword", resetPassword);

/* -------- logout -------- */
router.get("/logout", logout);

/* -------- ADMIN -------- */
router.post(
  "/create-admin",
  verifyToken,
  allowRoles("SUPER_ADMIN"),
  createAdmin,
);

export default router;
