import prisma from "../config/prisma.js";
import { generateApiKey } from "../utils/apiKey.js";
import { SERVICE_CONFIG } from "../config/service.config.js";


export const createProjectService = async ({ project_name, services, project_description, userId }) => {
  return await prisma.$transaction(async (tx) => {
    
    // ✅ 1. Validate input
    if (!project_name || !services || !Array.isArray(services) || services.length === 0) {
      throw new Error("Project name and services are required");
    }

    // ✅ 2. Create Project
    const project = await tx.project.create({
      data: {
        project_name,
        userId,
      },
    });

    const responseKeys = [];

    // ✅ 3. Loop through services
    for (const serviceType of services) {

      // 🔍 Validate service from config
      const config = SERVICE_CONFIG[serviceType];

      if (!config) {
        throw new Error(`Unsupported service: ${serviceType}`);
      }

      // ✅ 3.1 Create Service
      const service = await tx.service.create({
        data: {
          type: serviceType,
          projectId: project.id,
        },
      });

      // ✅ 3.2 Generate API Key
      const { rawKey, keyHash, lastFour } = generateApiKey(serviceType);

      // ✅ 3.3 Store API Key (ONLY HASH)
      const apiKey = await tx.apiKey.create({
        data: {
          keyHash,
          lastFour,
          serviceType,
          projectId: project.id,
          serviceId: service.id,
        },
      });

      // ✅ 3.4 Prepare response (raw key only once)
      responseKeys.push({
        service: serviceType,
        apiKey: rawKey,
        keyId: apiKey.id,
        endpoint:`${process.env.BASE_URL}${config.endpoint}`,
        method: config.method

      });
    }

    // ✅ 4. Return result
    return {
      project: {
        id: project.id,
        name: project.project_name,
      },
      services: responseKeys,
    };
  });
};

export const getAllProjects = async () => {
  return await prisma.project.findMany({
    select: {
      id: true,
      project_name: true,
      project_description: true,
      createdAt: true, // Double-check if there is a 'd' in your schema
      // services: true,  // Don't forget your services array!
      isActive: true
    },
  });
};