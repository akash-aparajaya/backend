import { createProjectService, getAllProjects } from "../services/project.service.js";
import { successResponse, errorResponse } from "../utils/response.js";


export const createProject = async (req, res) => {
  try {
    const { project_name,project_description, services } = req.body;
    const userId = req.user.id;

    const result = await createProjectService({
      project_name,
      services,
      project_description,
      userId,
    });

    return successResponse(res, result, "Project created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

export const getProjects = async (req, res) => {
  try {
    const projects = await getAllProjects();
    for (let i = 0; i < projects.length; i++) {
     projects[i].services = ["sms", "email",  "whatsapp"];
    }
    console.log(projects)
    return successResponse(res, projects, "Projects fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};