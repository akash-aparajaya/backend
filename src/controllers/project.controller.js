import {
  createProjectService,
  getAllProjects,
  updateProjectStatusService,
  getProjectById,
  createEnvironmentService,
  getEnvironmentsByProjectIdService,
  updateEnvironmentByIdService,
  deleteEnvironmentByIdService,
  assignUnassignEmployeeToEnvironmentService,
  getAssignedAndUnassignedEmployeesService
} from "../services/project.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* -------- create project -------- */
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

/* -------- get all projects -------- */
export const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    return successResponse(res, projects, "Projects fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- get project by id -------- */
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

/* -------- update project status -------- */
export const updateProjectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;
    const result = await updateProjectStatusService(id, isActive);
    return successResponse(res, result, "Project status updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- create environment -------- */
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

/* -------- get environments by project id -------- */
export const getEnvironmentsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await getEnvironmentsByProjectIdService(projectId);
    return successResponse(res, project, "Environments fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- update environment by id -------- */
export const updateEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { environment_name } = req.body;
    const result = await updateEnvironmentByIdService(id, environment_name);
    return successResponse(res, result, "Environment updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- delete environment by id -------- */
export const deleteEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteEnvironmentByIdService(id);
    return successResponse(res, result, "Environment deleted successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- assign unassign employee to project specific environment -------- */
export const assignUnassignEmployeeToEnvironment = async (req, res) => {
  try {
    const { environmentId } = req.params;

    const { project_id, userId, status } = req.body;

    const result = await assignUnassignEmployeeToEnvironmentService(
      environmentId,
      project_id,
      userId,
      status,
    );

    return successResponse(res, result, result.message);
  } catch (error) {
    return errorResponse(
      res,
      "Failed to update employee assignment",
      error.message,
    );
  }
};

/* -------- get assigned and unassigned employees -------- */
export const getAssignedAndUnassignedEmployees = async (req, res) => {
  try {
    const { project_id, environment_id } = req.body;

    const result = await getAssignedAndUnassignedEmployeesService(
      project_id,
      environment_id,
    );

    return successResponse(res, result, "Employees fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch employees", error.message);
  }
};
