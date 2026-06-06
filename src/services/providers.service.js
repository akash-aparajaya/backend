import prisma from "../config/prisma.js";

/* -------- get all Services -------- */
export const getAllServices = async (environmentId) => {
  const services = await prisma.ServiceType.findMany({
    where: { is_active: true },
    select: {
      public_id: true,
      name: true,
      slug: true,
      service_base_endpoint: true,
      is_active: true,
      is_failover: true,
    },
  });

  if (!environmentId) {
    return services;
  }
  const providerCounts = await prisma.EnvironmentServiceProvider.groupBy({
    by: ["service_type_id"],

    where: {
      environment_id: environmentId,
    },

    _count: {
      public_id: true,
    },
  });

  const countMap = {};

  providerCounts.forEach((item) => {
    countMap[item.service_type_id] = item._count.public_id;
  });

  return services.map((service) => ({
    ...service,
    provider_count: countMap[service.public_id] || 0,
  }));
};

/* -------- get providers by environment id -------- */
export const getProvidersByEnvironmentId = async (environmentId, serviceId) => {
  const providers = await prisma.environmentServiceProvider.findMany({
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

  const maskValue = (value) => {
    if (!value || typeof value !== "string") {
      return value;
    }

    if (value.length <= 4) {
      return "*".repeat(value.length);
    }

    const first = value.slice(0, 2);
    const last = value.slice(-2);

    return first + "*".repeat(value.length - 4) + last;
  };

  const formattedProviders = providers.map((provider) => ({
    ...provider,

    credentials: Object.fromEntries(
      Object.entries(provider.credentials || {}).map(([key, value]) => [
        key,

        key === "mode" ? value : maskValue(value),
      ]),
    ),

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

/* -------- get providers by service id -------- */
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

  if (!providers) {
    throw {
      message: "Failed to retrieve providers",
      statusCode: 500,
    };
  }

  return providers;
};

/* -------- get provider by id -------- */
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

  if (!provider) {
    throw {
      message: "Failed to retrieve provider",
      statusCode: 500,
    };
  }

  return provider;
};

/* -------- create provider -------- */
export const assignProviderToEnvironment = async ({
  environment_id,
  service_type_id,
  provider_id,
  mode,
  credentials,
  endpoint,
  provider_name,
  provider_slug,
}) => {
  const serviceType = await prisma.serviceType.findUnique({
    where: {
      public_id: service_type_id,
    },
    select: {
      is_failover: true,
    },
  });

  const existingCount = await prisma.environmentServiceProvider.count({
    where: {
      environment_id,
      service_type_id,
      mode,
      is_active: true,
    },
  });

  const newSortOrder = existingCount + 1;
  if (!serviceType?.is_failover) {
    const modes = ["LIVE", "SANDBOX"];

    const results = [];

    for (const targetMode of modes) {
      const existingCount = await prisma.environmentServiceProvider.count({
        where: {
          environment_id,
          service_type_id,
          mode: targetMode,
          is_active: true,
        },
      });

      const provider = await prisma.environmentServiceProvider.upsert({
        where: {
          environment_id_service_type_id_provider_id_mode_is_active: {
            environment_id,
            service_type_id,
            provider_id,
            mode: targetMode,
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
          mode: targetMode,
          provider_name,
          is_active: true,
          sort_order: existingCount + 1,
          provider_slug,
        },
      });

      results.push(provider);
    }

    return results[0];
  }

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

  return envProvider;
};

/* -------- update provider -------- */
export const updateProviderInEnvironment = async ({
  id,
  credentials,
  is_active,
}) => {
  const provider = await prisma.environmentServiceProvider.update({
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

  if (!provider) {
    throw {
      message: "Failed to update provider",
      statusCode: 500,
    };
  }

  return provider;
};

/* -------- delete provider -------- */
export const deleteProviderFromEnvironment = async (id) => {
  const provider = await prisma.environmentServiceProvider.delete({
    where: {
      public_id: id,
    },
  });

  if (!provider) {
    throw {
      message: "Failed to delete provider",
      statusCode: 500,
    };
  }

  return provider;
};

/* -------- reveal provider credentials -------- */
export const revealProvider = async (id) => {
  const provider = await prisma.environmentServiceProvider.findFirst({
    where: {
      public_id: id,
      is_active: true,
    },
  });

  if (!provider) {
    throw {
      message: "Failed to retrieve provider",
      statusCode: 500,
    };
  }

  return provider.credentials;
};

// Returns original credentials after authentication
export const unlockServiceCredentials = async ({
  environmentId,
  serviceId,
}) => {
  const providers = await prisma.environmentServiceProvider.findMany({
    where: {
      environment_id: environmentId,
      service_type_id: serviceId,
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
    where: {
      public_id: serviceId,
    },
    select: {
      service_base_endpoint: true,
    },
  });

  const result = {
    live: [],
    sandbox: [],
    live_count: 0,
    sandbox_count: 0,
  };

  providers.forEach((provider) => {
    const item = {
      ...provider,

      endpoint: service?.service_base_endpoint || "",
    };

    if (provider.mode === "LIVE") {
      result.live.push(item);

      result.live_count++;
    } else {
      result.sandbox.push(item);

      result.sandbox_count++;
    }
  });

  return result;
};
