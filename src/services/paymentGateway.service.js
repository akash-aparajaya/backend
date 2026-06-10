import paymentGatewayProviders from "../workers/payment-gateway/index.js";

/* ==========================================
   CUSTOMER
========================================== */

export const createPaymentGatewayCustomer = async (payload) => {
  const provider = paymentGatewayProviders[payload.provider];

  if (!provider) {
    throw new Error(`Unsupported provider: ${payload.provider}`);
  }

  return provider.createCustomer(payload, payload.credentials);
};

/* ==========================================
   PAYMENT METHOD
========================================== */

export const createPaymentGatewayPaymentMethod = async (payload) => {
  const provider = paymentGatewayProviders[payload.provider];

  if (!provider) {
    throw new Error(`Unsupported provider: ${payload.provider}`);
  }

  return provider.createPaymentMethod(payload, payload.credentials);
};

/* ==========================================
   PAYMENT
========================================== */

export const createPaymentGatewayPayment = async (payload) => {
  const provider = paymentGatewayProviders[payload.provider];

  if (!provider) {
    throw new Error(`Unsupported provider: ${payload.provider}`);
  }

  return provider.createPayment(payload, payload.credentials);
};

export const getPaymentGatewayPayment = async (
  paymentId,
  providerName,
  credentials,
) => {
  const provider = paymentGatewayProviders[providerName];

  if (!provider) {
    throw new Error(`Unsupported provider: ${providerName}`);
  }

  return provider.getPayment(paymentId, credentials);
};

/* ==========================================
   REFUND
========================================== */

export const refundPaymentGatewayPayment = async (payload) => {
  const provider = paymentGatewayProviders[payload.provider];

  if (!provider) {
    throw new Error(`Unsupported provider: ${payload.provider}`);
  }

  return provider.refundPayment(
    payload.paymentId,
    payload.amount,
    payload.credentials,
  );
};
