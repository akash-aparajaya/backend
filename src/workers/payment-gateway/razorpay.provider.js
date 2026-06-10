import axios from "axios";

const BASE_URL = "https://api.razorpay.com/v1";

const authHeaders = (credentials) => {
  const token = Buffer.from(
    `${credentials.key_id}:${credentials.key_secret}`,
  ).toString("base64");

  return {
    Authorization: `Basic ${token}`,
    "Content-Type": "application/json",
  };
};

export default {
  createCustomer: async (data, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/customers`,
        {
          name: data.name,
          email: data.email,
          contact: data.phone,
        },
        {
          headers: authHeaders(credentials),
        },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Razorpay createCustomer failed: ${
          err.response?.data?.error?.description || err.message
        }`,
      );
    }
  },

  createPaymentMethod: async () => {
    return {
      message: "Use Razorpay Checkout for card collection",
    };
  },

  createPayment: async (data, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/orders`,
        {
          amount: Math.round(Number(data.amount) * 100),
          currency: data.currency || "INR",
          receipt: data.receipt || `receipt_${Date.now()}`,
        },
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        orderId: res.data.id,
        amount: res.data.amount,
        currency: res.data.currency,
        status: res.data.status,
      };
    } catch (err) {
      throw new Error(
        `Razorpay createPayment failed: ${
          err.response?.data?.error?.description || err.message
        }`,
      );
    }
  },

  getPayment: async (paymentId, credentials) => {
    try {
      const res = await axios.get(`${BASE_URL}/payments/${paymentId}`, {
        headers: authHeaders(credentials),
      });

      return res.data;
    } catch (err) {
      throw new Error(
        `Razorpay getPayment failed: ${
          err.response?.data?.error?.description || err.message
        }`,
      );
    }
  },

  refundPayment: async (paymentId, amount, credentials) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/payments/${paymentId}/refund`,
        amount
          ? {
              amount: Math.round(Number(amount) * 100),
            }
          : {},
        {
          headers: authHeaders(credentials),
        },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Razorpay refundPayment failed: ${
          err.response?.data?.error?.description || err.message
        }`,
      );
    }
  },
};
