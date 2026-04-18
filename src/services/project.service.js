import prisma from "../config/prisma.js";
import crypto from "crypto";

export const createProjectService = async (userId, { project_name, services, project_description }) => {
    
  const apiKey = crypto.randomBytes(32).toString("hex");

  return prisma.project.create({
    data: {
       project_name,
       project_description,
      apiKey,
      userId,
      services: {
        create: services.map((s) => ({ type: s })),
      },
    },
  });
};