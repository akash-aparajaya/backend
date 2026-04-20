import { createProjectService } from "../services/project.service.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const createProject = async (req, res) => {
  try {
    const { name, services } = req.body;
    const userId = req.user.id;

    const result = await createProjectService({
      name,
      services,
      userId,
    });

    return successResponse(res, result, "Project created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};