import express from "express";
import {
  login,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  validateSetupToken,
  completeSetup,
  userVerifySensitiveUserAccess,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* -------- LOGIN -------- */
router.post("/login", login);

/* -------- REFRESH TOKEN -------- */
router.post("/refresh-token", refreshAccessToken);

/* -------- FORGOT PASSWORD -------- */
router.post("/forgotPassword", forgotPassword);

/* -------- RESET PASSWORD -------- */
router.post("/resetPassword", resetPassword);

/* -------- update password -------- */
router.patch("/update-password", verifyToken, updatePassword);

/* -------- logout -------- */
router.get("/logout", logout);

/* -------- verify-sensitive-user-access -------- */
router.post(
  "/verify-sensitive-user-access",
  verifyToken,
  userVerifySensitiveUserAccess,
);

/* -------- setup-account -------- */
router.get("/setup-account/:token", validateSetupToken);

/* -------- setup-password-and-passkey -------- */
router.post("/setup-account", completeSetup);

export default router;
