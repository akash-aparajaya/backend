import prisma from "../config/prisma.js";

export const getAllProviders = async () => {
  const providers = await prisma.provider.findMany({
    where: {
      is_deleted: false,
    },
  });

  return providers;
};

export const getAllServices = async () => {
  const services = await prisma.service.findMany({
    where: { is_deleted: false },
  });

  return services;
};

export const getProviderById = async (id) => {
  const provider = await prisma.provider.findFirst({
    where: { public_id: id },
  });

  return provider;
};

export const getProviderByServiceId = async (serviceId) => {
  const provider = await prisma.serviceProvider.findMany({
    where: { service_id: serviceId },
  });    

  return provider;
};