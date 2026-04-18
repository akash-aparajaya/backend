import { createAdminService } from "../services/admin.service.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const createAdmin = async (req, res) => {
  try {
     const { user_name, email, password } = req.body;

    const admin = await createAdminService({ user_name, email, password });
    return successResponse(res, admin, "Admin created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};