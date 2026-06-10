import axios from "axios";

const BASE_URL = "https://gateway.loanpaymentpro.com";

const authHeaders = (credentials) => {
  return {
    TransactionKey: credentials.transaction_key,
    "Content-Type": "application/x-www-form-urlencoded",
  };
};

export default {
  /* ==========================================
     CUSTOMER (NOT CONFIRMED API)
  ========================================== */

  createCustomer: async (data) => {
    return {
      message:
        "Loan Payment Pro customer API not confirmed",
      data,
    };
  },

  /* ==========================================
     PAYMENT METHOD (NOT CONFIRMED API)
  ========================================== */

  createPaymentMethod: async () => {
    return {
      message:
        "Loan Payment Pro uses stored payment cards (API not confirmed)",
    };
  },

  /* ==========================================
     PAYMENT (ACH - COLLECT MONEY)
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const body = new URLSearchParams({
        InvoiceId: data.invoice_id || "1",
        Amount: String(data.amount),
      });

      const res = await axios.post(
        `${BASE_URL}/v2/payments/customers/${data.customer_id}/paymentcards/${data.payment_method_id}/run`,
        body.toString(),
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        paymentId: res.data?.PaymentId || res.data?.id,
        status: res.data?.Status,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `Loan Payment Pro createPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     GET PAYMENT STATUS
  ========================================== */

  getPayment: async (paymentId, credentials) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/v2-1/transactions/${paymentId}`,
        {
          headers: authHeaders(credentials),
        },
      );

      return {
        paymentId,
        status:
          res.data?.Status ||
          res.data?.TransactionStatus,
        response: res.data,
      };
    } catch (err) {
      throw new Error(
        `Loan Payment Pro getPayment failed: ${
          err.response?.data?.message ||
          err.message
        }`,
      );
    }
  },

  /* ==========================================
     REFUND (NOT CONFIRMED)
  ========================================== */

  refundPayment: async () => {
    return {
      message:
        "Loan Payment Pro refund API not confirmed",
    };
  },

};