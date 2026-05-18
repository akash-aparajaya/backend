import {
  createProjectService,
  getAllProjects,
  updateProjectStatusService,
  getProjectById,
  createEnvironmentService,
} from "../services/project.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createProject = async (req, res) => {
  try {
    const { project_name, project_description, isActive, image_url } = req.body;

    const userId = req.user.id;

    const result = await createProjectService({
      project_name,
      project_description,
      userId,
      isActive,
      image_url,
    });

    return successResponse(res, result, "Project created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    return successResponse(res, projects, "Projects fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getProjectId = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);
    console.log(project);
    return successResponse(res, project, "Project fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.query;
    const result = await updateProjectStatusService(id, isActive);
    return successResponse(res, result, "Project status updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const createEnvironment = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { environment_name } = req.body;
    const result = await createEnvironmentService({
      projectId,
      environment_name,
    });
    return successResponse(
      res,
      result,
      "Environment created successfully",
      201,
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
