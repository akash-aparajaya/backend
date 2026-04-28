import { createAdminService } from "../services/admin.service.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const createAdmin = async (req, res) => {
  try {
    const data = req.body
     const { name, email, password ,role} = data;

    const admin = await createAdminService({ name, email, password ,role});
    return successResponse(res, admin, "Admin created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};