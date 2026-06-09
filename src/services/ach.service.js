// services/ach.service.js

import prisma from "../config/prisma.js";
import { providers } from "../workers/ach/index.js";

let achServiceTypeId = null;

const getACHServiceTypeId = async () => {
  if (achServiceTypeId) return achServiceTypeId;

  const serviceType = await prisma.serviceType.findFirst({
    where: { slug: "ach" },
    select: { public_id: true },
  });

  if (!serviceType) {
    throw new Error("ACH service type not found");
  }

  achServiceTypeId = serviceType.public_id;
  return achServiceTypeId;
};

const validateContext = (context) => {
  if (!context?.environment_id) throw new Error("environment_id is required");

  if (!context?.project_id) throw new Error("project_id is required");

  if (!context?.mode) throw new Error("mode is required");
};

const getProviderRecord = async ({ environment_id, provider_slug, mode }) => {
  const service_type_id = await getACHServiceTypeId();

  const record = await prisma.environmentServiceProvider.findFirst({
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

  if (!record) {
    throw new Error("ACH provider not found");
  }

  const provider = providers[record.provider_slug];

  if (!provider) {
    throw new Error(`Provider implementation missing: ${record.provider_slug}`);
  }

  return {
    record,
    provider,
  };
};

// =====================================================
// CREATE CUSTOMER
// =====================================================

export const createCustomer = async (data, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  return provider.createCustomer(data, record.credentials);
};

// =====================================================
// CREATE PAYMENT METHOD
// =====================================================

export const createPaymentMethod = async (data, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  return provider.createPaymentMethod(data, record.credentials);
};

// =====================================================
// CREATE PAYMENT
// =====================================================

export const createPayment = async (data, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  return provider.createPayment(data, record.credentials);
};

// =====================================================
// GET PAYMENT
// =====================================================

export const getPayment = async (paymentId, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  return provider.getPayment(paymentId, record.credentials);
};

// =====================================================
// REFUND PAYMENT
// =====================================================

export const refundPayment = async (paymentId, data, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  return provider.refundPayment(paymentId, data, record.credentials);
};

export const createDisbursement = async (data, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: data.provider_slug,
    mode: context.mode,
  });

  if (!provider.createDisbursement) {
    throw new Error("Disbursement not supported by this provider");
  }

  return provider.createDisbursement(data, record.credentials);
};

export const getDisbursementStatus = async (disbursementId, context) => {
  validateContext(context);

  const { record, provider } = await getProviderRecord({
    environment_id: context.environment_id,
    provider_slug: context.provider_slug,
    mode: context.mode,
  });

  if (!provider.getDisbursementStatus) {
    throw new Error("Disbursement status not supported by this provider");
  }

  return provider.getDisbursementStatus(disbursementId, record.credentials);
};
