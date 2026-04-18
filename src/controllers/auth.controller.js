import {
  loginUser,
  createSuperAdminService,
    refreshAccessByToken,
} from "../services/auth.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const login = async (req, res) => {
  try {
    const data = await loginUser({
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
    const { refreshToken } = req.body;  // Get the refresh token from the request body

    const tokens = await refreshAccessByToken({ refreshToken }); // Call the refreshAccessByToken function

    return successResponse(res, tokens, "Tokens refreshed successfully", 200);
  } catch (err) {
    errorResponse(res, err.message);
  }
};