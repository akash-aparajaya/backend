import {
  loginService,
  refreshService,
  logoutService,
  forgotPasswordService,
  resetPasswordService,
  updatePasswordService,
  validateSetupTokenService,
  completeSetupService,
  userVerification,
} from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* -------- LOGIN -------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const data = await loginService({
      email,
      password,
    });
    return successResponse(res, data, "Login successful");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- REFRESH TOKEN -------- */
export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies?.refreshToken ||
      req.body.refreshToken ||
      req.headers["x-refresh-token"];

    const tokens = await refreshService({ refreshToken });

    return successResponse(res, tokens, "Tokens refreshed successfully", 200);
  } catch (err) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- LOGOUT -------- */
export const logout = async (req, res) => {
  try {
    const userId = req.query.id;
    await logoutService(userId);
    return successResponse(res, null, "Logout successful", 200);
  } catch (err) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

/* -------- FORGOT PASSWORD -------- */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPasswordService(email);
    return successResponse(
      res,
      null,
      "Password reset link sent successfully",
      200,
    );
  } catch (err) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

/* -------- RESET PASSWORD -------- */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService(token, password);
    return successResponse(res, null, "Password reset successful", 200);
  } catch (err) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

/* -------- UPDATE PASSWORD -------- */
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const userId = req.user.id;
    console.log(userId, password);
    await updatePasswordService(userId, password);
    return successResponse(res, null, "Password changed successfully", 201);
  } catch (error) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

/* -------- USER VERIFY SENSITIVE USER ACCESS -------- */
export const userVerifySensitiveUserAccess = async (req, res) => {
  try {
    const { passKey } = req.body;
    const userId = req.user.id;
    const data = await userVerification(userId, passKey);
    return successResponse(res, data, "verification successfully done", 200);
  } catch (err) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

// -------- VALIDATE SETUP TOKEN  BEFORE LOGIN ----------
export const validateSetupToken = async (req, res) => {
  try {
    const result = await validateSetupTokenService(req.params.token);
    return successResponse(res, result, "Token validated");
  } catch (error) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

/* -------- COMPLETE SETUP PASSWORD AND PASSKEY -------- */
export const completeSetup = async (req, res) => {
  try {
    const result = await completeSetupService(req.body);
    return successResponse(res, result, "Account setup successful");
  } catch (error) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};
