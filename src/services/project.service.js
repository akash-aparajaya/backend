import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";

/* -------- create project -------- */
export const createProjectService = async ({
  project_name,
  project_description,
  userId,
  isActive,
  image_url,
}) => {
  if (!project_name) {
    throw {
      message: "Project name is required",
      statusCode: 400,
    };
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

  if (!project) {
    throw {
      message: "Failed to create project",
      statusCode: 500,
    };
  }

  return {
    project: {
      id: project.public_id,
      name: project.project_name,
      image_url: finalImageUrl,
      is_active: project.is_active,
    },
  };
};

/* -------- get all projects -------- */
export const getAllProjects = async () => {
  const projectData = await prisma.project.findMany({
    where: {
      is_deleted: false,
    },

    select: {
      id: true,
      public_id: true,
      project_name: true,
      project_description: true,
      image_url: true,
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

  if (!projectData) {
    throw {
      message: "Failed to retrieve projects",
      statusCode: 500,
    };
  }

  return projectData.map((project) => ({
    public_id: project?.public_id,
    project_name: project?.project_name,
    project_description: project?.project_description,
    image_url: project?.image_url,
    is_active: project?.is_active,
    created_at: new Date(project?.created_at).toDateString(),

    user: project?.user?.user_name,
    user_public_id: project?.user?.public_id,
  }));
};

/* -------- update project status -------- */
export const updateProjectStatusService = async (id, isActive) => {
  const result = await prisma.project.update({
    where: { public_id: id },
    data: { is_active: isActive },
  });
  if (!result) {
    throw {
      message: "Failed to update project status",
      statusCode: 500,
    };
  }
  return result;
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

  if (!project) {
    throw {
      message: "Failed to retrieve project",
      statusCode: 500,
    };
  }
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
    throw {
      message: "Environment name is required",
      statusCode: 400,
    };
  }

  const environment = await prisma.environment.create({
    data: {
      environment_name,

      project_id: projectId,
    },
  });

  if (!environment) {
    throw {
      message: "Failed to create environment",
      statusCode: 500,
    };
  }

  return environment;
};

export const updateProjectService = async (
  id,
  { project_name, project_description, isActive, image_url },
) => {
  let finalImageUrl;

  // upload new image if provided
  if (image_url) {
    const result = await cloudinary.uploader.upload(image_url, {
      folder: "tesseract-projects",
    });

    finalImageUrl = result.secure_url;
  }

  const updatedProject = await prisma.project.update({
    where: {
      public_id: id,
    },

    data: {
      ...(project_name !== undefined && {
        project_name,
      }),
      ...(project_description !== undefined && {
        project_description,
      }),
      ...(typeof isActive === "boolean" && {
        is_active: isActive,
      }),
      ...(finalImageUrl && {
        image_url: finalImageUrl,
      }),
    },
  });

  if (!updatedProject) {
    throw {
      message: "Failed to update project",
      statusCode: 500,
    };
  }

  return updatedProject;
};

export const deleteProjectService = async (id) => {
  const result = await prisma.project.update({
    where: {
      public_id: id,
    },

    data: {
      is_deleted: true,
    },
  });

  if (!result) {
    throw {
      message: "Failed to delete project",
      statusCode: 500,
    };
  }

  return result;
};

/* -------- get environments by project id -------- */
export const getEnvironmentsByProjectIdService = async (projectId) => {
  const environments = await prisma.environment.findMany({
    where: {
      project_id: projectId,
      is_deleted: false,
    },

    orderBy: {
      created_at: "asc",
    },

    select: {
      public_id: true,
      environment_name: true,
      is_active: true,
      created_at: true,
    },
  });

  if (!environments) {
    throw {
      message: "Failed to retrieve environments",
      statusCode: 500,
    };
  }

  return environments;
};

/* -------- update environment by id -------- */
export const updateEnvironmentByIdService = async (id, data) => {
  const result = await prisma.environment.update({
    where: {
      public_id: id,
    },

    data: {
      ...(data.environment_name !== undefined && {
        environment_name: data.environment_name,
      }),

      ...(typeof data.is_active === "boolean" && {
        is_active: data.is_active,
      }),
    },
  });

  if (!result) {
    throw {
      message: "Failed to update environment",
      statusCode: 500,
    };
  }

  return result;
};

/* -------- delete environment by id -------- */
export const deleteEnvironmentByIdService = async (id) => {
  // CHECK PROVIDERS EXIST
  const providers = await prisma.environmentServiceProvider.count({
    where: {
      environment_id: id,
      is_active: true,
    },
  });

  if (providers > 0) {
    throw {
      message: "Cannot delete environment with active providers",
      statusCode: 400,
    };
  }

  // SOFT DELETE
  const result = await prisma.environment.update({
    where: {
      public_id: id,
    },
    data: {
      is_deleted: true,
    },
  });

  if (!result) {
    throw {
      message: "Failed to delete environment",
      statusCode: 500,
    };
  }

  return result;
};

/* -------- clone environment by id -------- */
export const cloneEnvironmentByIdService = async (id, environment_name) => {
  // GET SOURCE ENVIRONMENT
  const sourceEnvironment = await prisma.environment.findUnique({
    where: {
      public_id: id,
    },
  });

  if (!sourceEnvironment) {
    throw {
      message: "Failed to clone environment",
      statusCode: 500,
    };
  }

  // CREATE NEW ENVIRONMENT
  const clonedEnvironment = await prisma.environment.create({
    data: {
      project_id: sourceEnvironment.project_id,
      environment_name,
      is_active: true,
    },
  });

  // GET ALL PROVIDERS
  const providers = await prisma.environmentServiceProvider.findMany({
    where: {
      environment_id: sourceEnvironment.public_id,
    },
  });

  if (!providers) {
    throw {
      message: "Failed to clone environment",
      statusCode: 500,
    };
  }

  // CLONE PROVIDERS
  for (const provider of providers) {
    const credentials =
      typeof provider.credentials === "object" && provider.credentials !== null
        ? { ...provider.credentials }
        : {};

    // REMOVE TOKENS / API KEYS
    delete credentials.api_key;
    delete credentials.token;
    delete credentials.access_token;

    await prisma.environmentServiceProvider.create({
      data: {
        environment_id: clonedEnvironment.public_id,

        service_type_id: provider.service_type_id,

        provider_id: provider.provider_id,

        provider_name: provider.provider_name,

        credentials,

        mode: provider.mode,

        endpoint: provider.endpoint,

        is_active: true,
      },
    });
  }

  return clonedEnvironment;
};

/*-------- Assign / unassigned employee to project specific environment -------- */
export const assignUnassignEmployeeToEnvironmentService = async (
  environment_id,
  project_id,
  userIds,
  status,
) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    throw {
      message: "User ID array is required and cannot be empty",
      statusCode: 400,
    };
  }

  const updatedUsers = [];
  const createdUsers = [];

  for (const userId of userIds) {
    const existingEmployee = await prisma.environmentEmployee.findFirst({
      where: {
        environment_id,
        user_id: userId,
      },
    });

    if (existingEmployee) {
      await prisma.environmentEmployee.update({
        where: {
          public_id: existingEmployee.public_id,
        },
        data: { status },
      });

      updatedUsers.push(userId);
    } else {
      await prisma.environmentEmployee.create({
        data: {
          project_id,
          environment_id,
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
    throw {
      message: "No employees found",
      statusCode: 404,
    };
  }

  // Get assigned employees from environment table
  const environmentEmployees = await prisma.environmentEmployee.findMany({
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
    (employee) => !assignedUserIds.includes(employee.public_id),
  );

  return {
    assignedEmployees,
    unassignedEmployees,
  };
};

/* -------- GET ALL PROJECTS AND ENVIRONMENTS -------- */
export const getAllProjectsAndEnvironmentsService = async () => {
  const projects = await prisma.project.findMany({
    where: { is_active: true },
    select: {
      public_id: true,
      project_name: true,
      project_description: true,

      environments: {
        select: {
          public_id: true,
          environment_name: true,
          is_active: true,
        },
      },
    },
    orderBy: { created_at: "asc" },
  });

  return projects
    .filter((project) => project.environments.length > 0)
    .map((project) => ({
      id: project.public_id,
      name: project.project_name,
      description: project.project_description,
      environments: project.environments.map((env) => ({
        id: env.public_id,
        name: env.environment_name,
        status: env.is_active ? "ACTIVE" : "INACTIVE",
      })),
    }));
};

/* -------- ASSIGN ENVIRONMENT TO EMPLOYEE -------- */
export const assignEnvironmentToEmployeeService = async (data) => {
  if (!data || data.length === 0 || !Array.isArray(data)) {
    throw {
      message: "Data array is required and cannot be empty",
      statusCode: 400,
    };
  }
  const result = await prisma.environmentEmployee.createMany({ data });
  return result;
};

/* -------- REORDER PROVIDERS -------- */
export const reorderProvidersService = async (providers) => {
  const updates = providers.map((provider, index) => {
    return prisma.environmentServiceProvider.update({
      where: {
        public_id: provider.public_id,
      },

      data: {
        sort_order: index + 1,
      },
    });
  });

  await prisma.$transaction(updates);

  return true;
};
