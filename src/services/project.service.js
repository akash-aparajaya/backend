import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { generateApiKey } from "../utils/apiKey.js";
import { SERVICE_CONFIG } from "../config/service.config.js";

/* -------- create project -------- */
export const createProjectService = async ({
  project_name,
  project_description,
  userId,
  isActive,
  image_url,
}) => {
  if (!project_name) {
    throw new Error("Project name is required");
  }

  let finalImageUrl = null;

  // ✅ Upload Base64 directly
  if (image_url) {
    const result = await cloudinary.uploader.upload(image_url, {
      folder: "tesseract-projects",
    });

    finalImageUrl = result.secure_url;
  }

  const project = await prisma.project.create({
    data: {
      project_name,
      project_description,
      image_url: finalImageUrl,
      is_active: isActive,
      user_id: userId,
    },
  });

  return {
    project: {
      id: project.id,
      name: project.project_name,
      image_url: finalImageUrl,
      is_active: project.is_active,
    },
  };
};

/* -------- get all projects -------- */
export const getAllProjects = async () => {
  const projectData = await prisma.project.findMany({
    select: {
      id: true,
      public_id: true,
      project_name: true,
      is_active: true,
      created_at: true,

      user: {
        select: {
          public_id: true,
          user_name: true,
        },
      },
    },

    orderBy: {
      created_at: "desc",
    },
  });
  return projectData.map((project) => ({
    public_id: project?.public_id,
    project_name: project?.project_name,
    is_active: project?.is_active,
    created_at: new Date(project?.created_at).toDateString(),
    user: project?.user?.user_name,
    user_public_id: project?.user?.public_id,
  }));
};

/* -------- update project status -------- */
export const updateProjectStatusService = async (id, isActive) => {
  return await prisma.project.update({
    where: { public_id: id },
    data: { is_active: isActive },
  });
};

/* -------- get project by id -------- */
export const getProjectById = async (id) => {
  const project = await prisma.project.findFirst({
    where: {
      public_id: id,
    },

    select: {
      public_id: true,
      project_name: true,
      project_description: true,
      image_url: true,
      is_active: true,
      created_at: true,

      environments: {
        select: {
          public_id: true,
          environment_name: true,
          is_active: true,
          created_at: true,
        },
      },
    },
  });

  return {
    public_id: project?.public_id,
    project_name: project?.project_name,
    project_description: project?.project_description,
    image_url: project?.image_url,
    is_active: project?.is_active,

    created_at: project?.created_at
      ? new Date(project.created_at).toDateString()
      : null,

    environments: project?.environments,
  };
};

/* -------- create environment -------- */
export const createEnvironmentService = async ({
  projectId,
  environment_name,
}) => {
  if (!environment_name) {
    throw new Error("Environment name is required");
  }

  const environment = await prisma.environment.create({
    data: {
      environment_name,
      projectId,
    },
  });

  return environment;
};

/* -------- get environments by project id -------- */
export const getEnvironmentsByProjectIdService = async (projectId) => {
  const environments = await prisma.environment.findMany({
    where: {
      projectId,
      is_active: true,
    },
    select: {
      public_id: true,
      environment_name: true,
      is_active: true,
    },
    apiKeys: {
      select: {
        public_id: true,
        mode: true,
        note: true,
        expires_at: true,
      },
    },
  });

  return environments;
};

/* -------- update environment by id -------- */
export const updateEnvironmentByIdService = async (id, environment_name) => {
  return await prisma.environment.update({
    where: { public_id: id },
    data: { environment_name },
  });
};

/* -------- delete environment by id -------- */
export const deleteEnvironmentByIdService = async (id) => {
  return await prisma.environment.update({
    where: { public_id: id },
    data: { is_active: false },
  });
};

/*-------- Assign / unassigned employee to project specific environment -------- */
export const assignUnassignEmployeeToEnvironmentService = async (
  environmentId,
  project_id,
  userIds,
  status,
) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw new Error("userIds must be a non-empty array");
  }

  const updatedUsers = [];
  const createdUsers = [];

  for (const userId of userIds) {
    // Check existing employee
    const existingEmployee = await prisma.environmentEmployee.findFirst({
      where: {
        environment_id: environmentId,
        user_id: userId,
      },
    });

    // If employee exists -> update status
    if (existingEmployee) {
      await prisma.environmentEmployee.update({
        where: {
          public_id: existingEmployee.public_id,
        },
        data: {
          status,
        },
      });

      updatedUsers.push(userId);
    }

    // If employee does not exist -> create
    else {
      await prisma.environmentEmployee.create({
        data: {
          project_id,
          environment_id: environmentId,
          user_id: userId,
          status,
        },
      });

      createdUsers.push(userId);
    }
  }

  return {
    status,
    updatedUsers,
    createdUsers,
    message: status
      ? "Employees assigned successfully"
      : "Employees unassigned successfully",
  };
};

/* -------- get assigned and unassigned employees -------- */
export const getAssignedAndUnassignedEmployeesService = async (
  project_id,
  environment_id,
) => {
  // Get all employees from user table
  const employees = await prisma.user.findMany({
    where: {
      is_deleted: false,
    },
    select: {
      public_id: true,
      user_name: true,
      email: true,
      role: true,
      is_active: true,
    },
  });

  if (!employees || employees.length === 0) {
    throw new Error("No employees found");
  }

  // Get assigned employees from environment table
  const environmentEmployees =
    await prisma.environmentEmployee.findMany({
      where: {
        project_id,
        environment_id,
        status: true,
      },
      select: {
        user_id: true,
      },
    });

  // Convert assigned ids
  const assignedUserIds = environmentEmployees.map(
    (employee) => employee.user_id,
  );

  // Assigned employees
  const assignedEmployees = employees.filter((employee) =>
    assignedUserIds.includes(employee.public_id),
  );

  // Unassigned employees
  const unassignedEmployees = employees.filter(
    (employee) =>
      !assignedUserIds.includes(employee.public_id),
  );

  return {
    assignedEmployees,
    unassignedEmployees,
  };
};
