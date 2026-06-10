import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://api.phonepe.com/apis/hermes";

// Create checksum (PhonePe requirement)
const generateChecksum = (payload, endpoint, saltKey, saltIndex) => {
  const base64Payload = Buffer.from(
    JSON.stringify(payload),
  ).toString("base64");

  const string =
    base64Payload + endpoint + saltKey;

  const sha256 = crypto
    .createHash("sha256")
    .update(string)
    .digest("hex");

  return `${sha256}###${saltIndex}`;
};

const buildHeaders = (
  credentials,
  payload,
  endpoint,
) => {
  const checksum = generateChecksum(
    payload,
    endpoint,
    credentials.client_secret,
    credentials.client_version || "1",
  );

  return {
    "Content-Type": "application/json",
    "X-VERIFY": checksum,
    "X-MERCHANT-ID": credentials.merchant_id,
  };
};

export default {
  /* ==========================================
     CUSTOMER
  ========================================== */

  createCustomer: async (data) => {
    return {
      message:
        "PhonePe does not support direct customer creation via API",
      data,
    };
  },

  /* ==========================================
     PAYMENT METHOD
  ========================================== */

  createPaymentMethod: async () => {
    return {
      message:
        "PhonePe payment method handled via redirect flow",
    };
  },

  /* ==========================================
     PAYMENT
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const payload = {
        merchantId: credentials.merchant_id,
        merchantTransactionId: `TXN_${Date.now()}`,
        merchantUserId: data.customer_id || "USER123",
        amount: Math.round(data.amount * 100),
        redirectUrl:
          data.redirect_url ||
          "https://example.com/success",
        redirectMode: "POST",
        callbackUrl:
          data.callback_url ||
          "https://example.com/callback",
        paymentInstrument: {
          type: "PAY_PAGE",
        },
      };

      const endpoint =
        "/pg/v1/pay";

      const res = await axios.post(
        `${BASE_URL}${endpoint}`,
        {
          request: Buffer.from(
            JSON.stringify(payload),
          ).toString("base64"),
        },
        {
          headers: buildHeaders(
            credentials,
            payload,
            endpoint,
          ),
        },
      );

      return {
        transactionId:
          payload.merchantTransactionId,
        status: res.data,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `PhonePe createPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     GET PAYMENT
  ========================================== */

  getPayment: async (
    paymentId,
    credentials,
  ) => {
    try {
      const endpoint = `/pg/v1/status/${credentials.merchant_id}/${paymentId}`;

      const stringToHash =
        endpoint +
        credentials.client_secret;

      const checksum = crypto
        .createHash("sha256")
        .update(stringToHash)
        .digest("hex");

      const res = await axios.get(
        `${BASE_URL}${endpoint}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-VERIFY": `${checksum}###${credentials.client_version || "1"}`,
            "X-MERCHANT-ID":
              credentials.merchant_id,
          },
        },
      );

      return {
        paymentId,
        status: res.data,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `PhonePe getPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     REFUND
  ========================================== */

  refundPayment: async () => {
    return {
      message:
        "PhonePe refund depends on settlement flow and webhook processing",
    };
  },
};