import {
  createProjectService,
  getAllProjects,
  updateProjectStatusService,
  getProjectById,
  updateProjectService,
  deleteProjectService,
  createEnvironmentService,
  getEnvironmentsByProjectIdService,
  updateEnvironmentByIdService,
  deleteEnvironmentByIdService,
  cloneEnvironmentByIdService,
  assignUnassignEmployeeToEnvironmentService,
  getAssignedAndUnassignedEmployeesService,
  getAllProjectsAndEnvironmentsService,
  assignEnvironmentToEmployeeService
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

/* -------- update project -------- */
export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      project_name,
      project_description,
      isActive,
      image_url,
    } = req.body;

    const result = await updateProjectService(id, {
      project_name,
      project_description,
      isActive,
      image_url,
    });

    return successResponse(
      res,
      result,
      "Project updated successfully",
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/* -------- delete project -------- */
export const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await deleteProjectService(id);

    return successResponse(
      res,
      result,
      "Project deleted successfully",
    );
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

    const {
      environment_name,
      is_active,
    } = req.body;

    const result =
      await updateEnvironmentByIdService(
        id,
        {
          environment_name,
          is_active,
        }
      );

    return successResponse(
      res,
      result,
      "Environment updated successfully"
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      500
    );
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

export const cloneEnvironmentById = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      environment_name,
    } = req.body;

    const result =
      await cloneEnvironmentByIdService(
        id,
        environment_name
      );

    return successResponse(
      res,
      result,
      "Environment cloned successfully"
    );

  } catch (error) {
    console.error(error);

    return errorResponse(
      res,
      error.message || "Failed to clone environment",
      500
    );
  }
};

/* -------- assign unassign employee to project specific environment -------- */
export const assignUnassignEmployeeToEnvironment = async (req, res) => {
  try {
    const { project_id, environment_id, user_id, status } = req.body;

    const result = await assignUnassignEmployeeToEnvironmentService(
      environment_id,
      project_id,
      user_id,
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

    const { projectId, environmentId } = req.params;

    const project_id = projectId;
    const environment_id = environmentId;
    const result =
      await getAssignedAndUnassignedEmployeesService(
        project_id,
        environment_id,
      );

    return successResponse(
      res,
      result,
      "Employees fetched successfully"
    );

  } catch (error) {

    console.error(error);

    return errorResponse(
      res,
      error.message || "Failed to fetch employees",
      500
    );
  }
};

export const getAllProjectsAndEnvironments = async (req, res) => {
  try {
    const result = await getAllProjectsAndEnvironmentsService();
    return successResponse(
      res,
      result,
      "Projects and environments fetched successfully",
    );
  } catch (error) {
    return errorResponse(
      res,
      "Failed to fetch projects and environments",
      error.message,
    );
  }
};

export const assignEnvironmentToEmployee = async (req, res) => {
  try {
    const result = await assignEnvironmentToEmployeeService(req.body);
    return successResponse(
      res,
      result,
      "Environment assigned to employee successfully",
    );
  } catch (error) {
    return errorResponse(
      res,
      "Failed to assign environment to employee",
      error.message,
    );
  }
};
