import express from "express";
import {
  login,
  refreshAccessToken,
  logout,
  resetPassword,
  updatePassword,
  validateSetupToken,
  completeSetup,
  userVerifySensitiveUserAccess,
  updateCredentialPasskey, validateUserSecret,
  forgotPasskey,
  resetPasskey, forgotPasswordSelf,
  validatePasswordResetToken,
  validatePasskeyResetToken, forgotPassword,
} from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";

const router = express.Router();

/* -------- LOGIN -------- */
router.post("/login", login);

/* -------- REFRESH TOKEN -------- */
router.post("/refresh-token", refreshAccessToken);

/* -------- FORGOT PASSWORD SELF - used to verify is the user already logged in and then reset password - used in the profile page-------- */
router.post("/forgot-password-self", verifyToken, forgotPasswordSelf);

/* -------- FORGOT PASSWORD, used in the loggin page-------- */
router.post("/forgotPassword", forgotPassword);

/* -------- RESET PASSWORD -------- */
router.post("/resetPassword", resetPassword);

// Validate current password
router.post("/validate-user-secret", verifyToken, validateUserSecret);

/* -------- update password -------- */
router.patch("/update-password", verifyToken, updatePassword);

/* -------- logout -------- */
router.get("/logout", logout);

/* -------- verify-sensitive-user-access -------- */
router.post("/verify-sensitive-user-access", verifyToken, userVerifySensitiveUserAccess,);

/* -------- setup-account -------- */
router.get("/setup-account/:token", validateSetupToken);

/* -------- setup-password-and-passkey -------- */
router.post("/setup-account", completeSetup);

/* -------- update-credential-passkey -------- */
router.patch("/update-passkey", verifyToken, updateCredentialPasskey);

/* -------- forgot-passkey -------- */
router.post("/forgot-passkey", verifyToken, forgotPasskey);

/* -------- reset-passkey -------- */
router.post("/reset-passkey", resetPasskey);

/* -------- validate-password-reset -------- */
router.get("/validate-password-reset/:token", validatePasswordResetToken);

/* -------- validate-passkey-reset -------- */
router.get("/validate-passkey-reset/:token", validatePasskeyResetToken);

export default router;
