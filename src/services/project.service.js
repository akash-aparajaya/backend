import prisma from "../config/prisma.js";
import cloudinary from "../config/cloudinary.js";
import { generateApiKey } from "../utils/apiKey.js";
import { SERVICE_CONFIG } from "../config/service.config.js";

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

export const updateProjectStatusService = async (id, isActive) => {
  return await prisma.project.update({
    where: { public_id: id },
    data: { is_active: isActive },
  });
};

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
