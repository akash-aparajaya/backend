import prisma from "../config/prisma.js";

//* -------- get all Services -------- */
export const getAllServices = async () => {
  const services = await prisma.ServiceType.findMany({
    where: { is_active: true },
    select: {
      public_id: true,
      name: true,
      slug: true,
      is_active: true,
    },
  });

  return services;
};

// * -------- get providers by environment id -------- */
export const getProvidersByEnvironmentId = async (environmentId, serviceId) => {
  const providers = await prisma.environmentServiceProvider.findMany({
    where: {
      environment_id: environmentId,
      service_type_id: serviceId,
      is_active: true,
    },
    select: {
      public_id: true,
      provider_name: true,
      mode: true,
      endpoint: true,
      is_active: true,
    },
  });
  // 🧠 Group into live & sandbox
  const result = {
    live: [],
    sandbox: [],
    live_count: 0,
    sandbox_count: 0,
  };
  providers.forEach((provider) => {
    if (provider.mode === "live") {
      result.live.push(provider);
      result.live_count++;
    } else {
      result.sandbox.push(provider);
      result.sandbox_count++;
    }
  });
  return result;
};

//* -------- get providers by service id -------- */
export const getProvidersByServiceId = async (serviceId) => {
  const providers = await prisma.Provider.findMany({
    where: { service_type_id: serviceId },
    select: {
      public_id: true,
      name: true,
      slug: true,
      is_active: true,
    },
  });

  return providers;
};

//* -------- get provider by id -------- */
export const getProviderById = async (id) => {
  const provider = await prisma.Provider.findFirst({
    where: { public_id: id, is_active: true },
    select: {
      public_id: true,
      service_type_id: true,
      name: true,
      slug: true,
      required_credential_schema: true,
      base_endpoint: true,
      is_active: true,
    },
  });

  return provider;
};

//* -------- create provider -------- */
export const assignProviderToEnvironment = async ({
  environment_id,
  service_type_id,
  provider_id,
  mode,
  credentials,
  endpoint,
}) => {
  const envProvider = await prisma.environmentServiceProvider.upsert({
    where: {
      environment_id_service_type_id_provider_id: {
        environment_id,
        service_type_id,
        provider_id,
        mode,
      },
    },

    update: {
      credentials,
    },

    create: {
      environment_id,
      service_type_id,
      provider_id,
      credentials,
      endpoint,
      mode,
      is_active: true,
    },
  });

  return envProvider;
};

/* -------- update provider -------- */
export const updateProviderInEnvironment = async ({ id, credentials }) => {
  return await prisma.environmentServiceProvider.update({
    where: { public_id: id },
    data: { credentials },
  });
};

//* -------- delete provider -------- */
export const deleteProviderFromEnvironment = async (id) => {
  return await prisma.environmentServiceProvider.update({
    where: { public_id: id },
    data: { is_active: false },
  });
};
