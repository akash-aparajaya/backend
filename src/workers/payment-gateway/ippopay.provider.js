import axios from "axios";
import crypto from "crypto";

const BASE_URL = "https://api.ippopay.com/v1";

const authHeaders = (credentials) => {
  return {
    "Content-Type": "application/json",
    "x-api-key": credentials.public_key,
    "x-api-secret": credentials.secret_key,
  };
};

export default {
  /* ==========================================
     CUSTOMER
  ========================================== */

  createCustomer: async (data, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/customers`,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        customerId: res.data?.id,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `IppoPay createCustomer failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     PAYMENT METHOD
  ========================================== */

  createPaymentMethod: async (data) => {
    return {
      message:
        "IppoPay uses hosted checkout / tokenization handled by frontend",
      data,
    };
  },

  /* ==========================================
     PAYMENT
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const payload = {
        amount: Number(data.amount),
        currency: data.currency || "INR",
        reference_id:
          data.reference_id ||
          `ORDER_${Date.now()}`,
        customer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
        },
        return_url:
          data.return_url ||
          "https://example.com/success",
        notify_url:
          data.notify_url ||
          "https://example.com/webhook",
      };

      const res = await axios.post(
        `${BASE_URL}/payment-links`,
        payload,
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        paymentId: res.data?.id,
        paymentUrl: res.data?.payment_url,
        status: res.data?.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `IppoPay createPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     GET PAYMENT
  ========================================== */

  getPayment: async (paymentId, credentials) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/payments/${paymentId}`,
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        paymentId,
        status: res.data?.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `IppoPay getPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     REFUND
  ========================================== */

  refundPayment: async (paymentId, amount, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/payments/${paymentId}/refund`,
        {
          amount,
        },
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        refundId: res.data?.id,
        status: res.data?.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `IppoPay refundPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },
};