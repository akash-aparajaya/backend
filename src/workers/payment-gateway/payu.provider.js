import axios from "axios";
import crypto from "crypto";
import qs from "querystring";

const BASE_URL = "https://secure.payu.in";

const generateHash = (data, key, salt) => {
  // PayU hash sequence:
  // key|txnid|amount|productinfo|firstname|email|||||||||||salt

  const hashString = `${key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${salt}`;

  return crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");
};

export default {
  /* ==========================================
     CUSTOMER
  ========================================== */

  createCustomer: async (data) => {
    return {
      message:
        "PayU does not manage customers separately",
      data,
    };
  },

  /* ==========================================
     PAYMENT METHOD
  ========================================== */

  createPaymentMethod: async () => {
    return {
      message:
        "PayU uses hosted checkout for payment methods",
    };
  },

  /* ==========================================
     PAYMENT (CREATE TRANSACTION)
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const txnid =
        data.txnid ||
        `TXN_${Date.now()}`;

      const payload = {
        key: credentials.merchant_key,
        txnid,
        amount: String(data.amount),
        productinfo:
          data.productinfo || "Product Purchase",
        firstname: data.firstname || "Customer",
        email: data.email || "test@example.com",
        phone: data.phone || "",
        surl:
          data.success_url ||
          "https://example.com/success",
        furl:
          data.failure_url ||
          "https://example.com/failure",
        service_provider: "payu_paisa",
      };

      const hash = generateHash(
        payload,
        credentials.merchant_key,
        credentials.merchant_salt,
      );

      const formData = {
        ...payload,
        hash,
      };

      return {
        paymentUrl: `${BASE_URL}/_payment`,
        formData,
        txnid,
        status: "INITIATED",
      };
    } catch (err) {
      throw new Error(
        `PayU createPayment failed: ${
          err.message || err
        }`,
      );
    }
  },

  /* ==========================================
     GET PAYMENT STATUS
  ========================================== */

  getPayment: async (paymentId, credentials) => {
    try {
      const command = "verify_payment";

      const hashString = `${credentials.merchant_key}|${command}|${paymentId}|${credentials.merchant_salt}`;

      const hash = crypto
        .createHash("sha512")
        .update(hashString)
        .digest("hex");

      const form = qs.stringify({
        key: credentials.merchant_key,
        command,
        var1: paymentId,
        hash,
      });

      const res = await axios.post(
        `${BASE_URL}/merchant/postservice.php?form=2`,
        form,
        {
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded",
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
        `PayU getPayment failed: ${
          err.response?.data ||
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
        "PayU refunds are handled via settlement dashboard/API (varies by account)",
    };
  },
};