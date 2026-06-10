import axios from "axios";

const BASE_URL = "https://api-m.paypal.com";

const getAccessToken = async (credentials) => {
  const auth = Buffer.from(
    `${credentials.client_id}:${credentials.client_secret}`,
  ).toString("base64");

  const res = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return res.data.access_token;
};

export default {
  /* ==========================================
     CUSTOMER
  ========================================== */

  createCustomer: async (data, credentials) => {
    return {
      message: "PayPal does not support direct customer creation like Stripe.",
      customer: {
        name: data.name,
        email: data.email,
      },
    };
  },

  /* ==========================================
     PAYMENT METHOD
  ========================================== */

  createPaymentMethod: async () => {
    return {
      message: "PayPal payment methods are managed by PayPal.",
    };
  },

  /* ==========================================
     PAYMENT
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const accessToken = await getAccessToken(credentials);

      const res = await axios.post(
        `${BASE_URL}/v2/checkout/orders`,
        {
          intent: "CAPTURE",
          purchase_units: [
            {
              amount: {
                currency_code: data.currency || "USD",
                value: String(data.amount),
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        orderId: res.data.id,
        status: res.data.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `PayPal createPayment failed: ${
          err.response?.data?.message || err.message
        }`,
      );
    }
  },

  /* ==========================================
     GET PAYMENT
  ========================================== */

  getPayment: async (paymentId, credentials) => {
    try {
      const accessToken = await getAccessToken(credentials);

      const res = await axios.get(
        `${BASE_URL}/v2/checkout/orders/${paymentId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      return {
        paymentId: res.data.id,
        status: res.data.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `PayPal getPayment failed: ${
          err.response?.data?.message || err.message
        }`,
      );
    }
  },

  /* ==========================================
     REFUND
  ========================================== */

  refundPayment: async (captureId, amount, credentials) => {
    try {
      const accessToken = await getAccessToken(credentials);

      const body = amount
        ? {
            amount: {
              value: String(amount),
              currency_code: "USD",
            },
          }
        : {};

      const res = await axios.post(
        `${BASE_URL}/v2/payments/captures/${captureId}/refund`,
        body,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      return {
        refundId: res.data.id,
        status: res.data.status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `PayPal refundPayment failed: ${
          err.response?.data?.message || err.message
        }`,
      );
    }
  },
};
