import { createProjectService } from "../services/project.service.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const createProject = async (req, res) => {
  try {
    const {  project_name, services, project_description } = req.body;
    const project = await createProjectService(req.user.id, { project_name, services, project_description });
    return successResponse(res, project, "Project created successfully", 201);
  } catch (err) {
    return errorResponse(res, err.message, 400);
  }
};
