import prisma from "../config/prisma.js";
import { providers } from "../workers/ibv/index.js";

// =====================================================
// CACHE IBV SERVICE TYPE
// =====================================================

let ibvServiceTypeId = null;

const getIBVServiceTypeId = async () => {
  if (ibvServiceTypeId) return ibvServiceTypeId;

  let serviceType;
  try {
    serviceType = await prisma.serviceType.findFirst({
      where: { slug: "ibv" },
      select: { public_id: true },
    });
  } catch (err) {
    throw new Error("Failed to resolve IBV service type");
  }

  if (!serviceType) throw new Error("IBV service type not found");

  ibvServiceTypeId = serviceType.public_id;
  return ibvServiceTypeId;
};

// =====================================================
// VALIDATE CONTEXT
// =====================================================

const validateContext = (context) => {
  if (!context?.environment_id) throw new Error("environment_id is required");
  if (!context?.project_id) throw new Error("project_id is required");
  if (!context?.mode) throw new Error("mode is required");
};

const validateRequestId = (requestId) => {
  if (!requestId) throw new Error("requestId is required");
};

// =====================================================
// GET PROVIDER RECORD
// =====================================================

const getProviderRecord = async ({ environment_id, provider_slug, mode }) => {
  const service_type_id = await getIBVServiceTypeId();

  let record;
  try {
    record = await prisma.environmentServiceProvider.findFirst({
      where: {
        environment_id,
        service_type_id,
        provider_slug,
        mode,
        is_active: true,
      },
      select: {
        provider_slug: true,
        credentials: true,
      },
    });
  } catch (err) {
    throw new Error("Failed to resolve IBV provider");
  }

  if (!record) throw new Error("IBV provider not found");

  const provider = providers[record.provider_slug];
  if (!provider) {
    throw new Error(`Provider implementation missing: ${record.provider_slug}`);
  }

  return { record, provider };
};

// =====================================================
// GET PROVIDER + CREDENTIALS (external usage)
// =====================================================

export const getServicesAndCredentials = async (data) => {
  if (!data?.provider_slug) throw new Error("provider_slug is required");
  if (!data?.environment_id) throw new Error("environment_id is required");
  if (!data?.mode) throw new Error("mode is required");

  const { record } = await getProviderRecord({
    environment_id: data.environment_id,
    provider_slug: data.provider_slug,
    mode: data.mode,
  });

  return record;
};

// =====================================================
// START IBV FLOW
// =====================================================

export const startIBV = async (data, context) => {
  validateContext({ ...context, provider_slug: data?.provider_slug });

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  const result = await provider.start(data, record.credentials);

  // Optional: persist request tracking
  // await prisma.ibv.create({
  //   data: {
  //     request_code: result.requestId,
  //     provider: record.provider_slug,
  //     status: "pending",
  //   },
  // });

  return result;
};

// =====================================================
// GET IBV STATUS
// =====================================================

export const getStatus = async (requestId, context) => {
  validateRequestId(requestId);
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  return provider.status(requestId, record.credentials);
};

// =====================================================
// GET IBV REPORT
// =====================================================

export const getReport = async (requestId, context) => {
  validateRequestId(requestId);
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  return provider.report(requestId, record.credentials);
};

// =====================================================
// GENERATE CHIRP LINK
// =====================================================

export const generateChirpLink = async (requestId, context) => {
  if (!requestId) throw new Error("requestId is required");
  validateRequestId(requestId);
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  if (!provider?.link) {
    throw new Error("Link method not supported by this provider");
  }

  return provider.link(requestId, record.credentials);
};

// =====================================================
// CANCEL IBV REQUEST
// =====================================================

export const cancelIBV = async (requestId, context) => {
  validateRequestId(requestId);
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  return provider.cancel(requestId, record.credentials);
}
