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
      isActive,
      userId,
    },
  });

  return {
    project: {
      id: project.id,
      name: project.project_name,
      image_url: finalImageUrl,
    },
  };
};
export const getAllProjects = async () => {
  return await prisma.project.findMany({
    select: {
      id: true,
      project_name: true,
      project_description: true,
      createdAt: true, 
      isActive: true,
    },
  });
};
export const getProjectById = async (id) => {
  const project = await prisma.project.findFirst({
    where: { id },select: {
      id: true,
      project_name: true,
      createdAt: true, 
      isActive: true,
    }
  });
  return {
    id: project?.id,
    project_name: project?.project_name,
    isActive: project?.isActive,
    createdAt: new Date(project?.createdAt).toDateString(),
  };
};

export const updateProjectStatusService = async (id, isActive) => {
  return await prisma.project.update({
    where: { id },
    data: { isActive },
  });
};
