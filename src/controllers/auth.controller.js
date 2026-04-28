import {
  loginService,
  createSuperAdminService,
    refreshService,
    logoutService, 
    forgotPasswordService,
    resetPasswordService
} from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const login = async (req, res) => {
  try {
    const data = await loginService({
      email: req.body.email,
      password: req.body.password,
    });
    return successResponse(res, data, "Login successful");
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const createSuperAdmin = async (req, res) => {
  try {
    const { user_name, email, password } = req.body;

    const admin = await createSuperAdminService({ user_name, email, password });

    return successResponse(res, admin, "Super admin created successfully", 201);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const refreshAccessToken = async (req, res) => {
  try {

const refreshToken =
  req.cookies?.refreshToken ||
  req.body.refreshToken ||
  req.headers["x-refresh-token"];

    const tokens = await refreshService({ refreshToken }); 
    
    return successResponse(res, tokens, "Tokens refreshed successfully", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.query.id;   
    await logoutService(userId);
    return successResponse(res, null, "Logout successful", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await forgotPasswordService({ email });
    return successResponse(res, null, "Password reset link sent successfully", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    await resetPasswordService( token, password );
    return successResponse(res, null, "Password reset successful", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};

