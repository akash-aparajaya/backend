import prisma from "../config/prisma.js";

//* -------- get all Services -------- */
export const getAllServices = async () => {
  const services = await prisma.ServiceType.findMany({
    where: { is_active: true },
    select: {
      public_id: true,
      name: true,
      slug: true,
      service_base_endpoint: true,
      is_active: true,
    },
  });

  return services;
};

// * -------- get providers by environment id -------- */
export const getProvidersByEnvironmentId =
  async (environmentId, serviceId) => {

    const providers =
      await prisma.environmentServiceProvider.findMany({
        where: {
          environment_id: environmentId,
          service_type_id: serviceId,
          // is_active: true,
        },

        orderBy: {
          sort_order: "asc",
        },

        select: {
          public_id: true,
          provider_name: true,
          mode: true,
          is_active: true,
          last_error_message: true,
          last_failed_at: true,
          credentials: true,
          sort_order: true,
          provider: {
            select: {
              base_endpoint: true,
              slug: true,
            },
          },
        },
      });

    const service = await prisma.serviceType.findFirst({
      where: { public_id: serviceId },
      select: { service_base_endpoint: true },
    });

    const formattedProviders =
      providers.map((provider) => ({
        ...provider,

        endpoint: service?.service_base_endpoint || "",
      }));

    const result = {
      live: [],
      sandbox: [],
      live_count: 0,
      sandbox_count: 0,
    };

    formattedProviders.forEach((provider) => {

      if (provider.mode === "LIVE") {

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
  provider_name,
  provider_slug
}) => {

  const existingCount = await prisma.environmentServiceProvider.count({
    where: {
      environment_id,
      service_type_id,
      mode,
      is_active: true,
    },
  });

  const newSortOrder = existingCount + 1;
  console.log("🔢 New sort_order:", newSortOrder);
  const envProvider = await prisma.environmentServiceProvider.upsert({
    where: {
      environment_id_service_type_id_provider_id_mode_is_active: {
        environment_id,
        service_type_id,
        provider_id,
        mode,
        is_active: true,
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
      provider_name,
      is_active: true,
      sort_order: newSortOrder,
      provider_slug,
    },
  });
  console.log("✅ Created provider:", envProvider.sort_order);
  return envProvider;
};

/* -------- update provider -------- */
export const updateProviderInEnvironment = async ({
  id,
  credentials,
  is_active,
}) => {

  return await prisma.environmentServiceProvider.update({
    where: {
      public_id: id,
    },

    data: {

      ...(credentials && {
        credentials,

        // CLEAR OLD ERROR STATE
        last_error_message: null,
        last_failed_at: null,
      }),

      ...(typeof is_active === "boolean" && {
        is_active,
      }),

    },
  });

};

//* -------- delete provider -------- */
export const deleteProviderFromEnvironment = async (id) => {

  return await prisma.environmentServiceProvider.delete({
    where: {
      public_id: id,
    },
  });

};
