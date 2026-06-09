// workers/ach/loan-payment-pro.js

import axios from "axios";

const BASE_URL = "https://gateway.loanpaymentpro.com";

const authHeaders = (transaction_key) => ({
  TransactionKey: transaction_key,
  "Content-Type": "application/x-www-form-urlencoded",
});

export const loanPaymentProProvider = {
  createCustomer: async (data, credentials) => {
    try {
      const body = new URLSearchParams({
        FirstName: data.first_name,
        LastName: data.last_name,
      });

      const res = await axios.post(
        `${BASE_URL}/v2/customers/add`,
        body.toString(),
        {
          headers: authHeaders(credentials.transaction_key),
        },
      );

      return {
        customerId: res.data.CustomerToken,
      };
    } catch (err) {
      throw new Error(
        `Loan Payment Pro createCustomer failed: ${
          err.response?.status || err.message
        }`,
      );
    }
  },

  createPaymentMethod: async (data, credentials) => {
    try {
      const body = new URLSearchParams({
        CardNumber: data.card_number,
        ExpMonth: data.exp_month,
        ExpYear: data.exp_year,
        CardCode: data.cvc,
      });

      const res = await axios.post(
        `${BASE_URL}/v2/customers/${data.customer_id}/paymentcards/add`,
        body.toString(),
        {
          headers: authHeaders(credentials.transaction_key),
        },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Loan Payment Pro createPaymentMethod failed: ${
          err.response?.status || err.message
        }`,
      );
    }
  },

  createPayment: async (data, credentials) => {
    try {
      const body = new URLSearchParams({
        InvoiceId: "1",
        Amount: String(data.amount),
      });

      const res = await axios.post(
        `${BASE_URL}/v2/payments/customers/${data.customer_id}/paymentcards/${data.payment_method_id}/run`,
        body.toString(),
        {
          headers: authHeaders(credentials.transaction_key),
        },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Loan Payment Pro createPayment failed: ${
          err.response?.status || err.message
        }`,
      );
    }
  },

  getPayment: async (paymentId, credentials) => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/payments/${paymentId}`, {
        headers: authHeaders(credentials.transaction_key),
      });

      return res.data;
    } catch (err) {
      throw new Error(
        `Loan Payment Pro getPayment failed: ${
          err.response?.status || err.message
        }`,
      );
    }
  },

  refundPayment: async (paymentId, data, credentials) => {
    try {
      const body = new URLSearchParams({
        InvoiceId: data.invoice_id,
        Amount: String(data.amount),
      });

      const res = await axios.post(
        `${BASE_URL}/v2/payments/${paymentId}/refund`,
        body.toString(),
        {
          headers: authHeaders(credentials.transaction_key),
        },
      );

      return res.data;
    } catch (err) {
      throw new Error(
        `Loan Payment Pro refundPayment failed: ${
          err.response?.status || err.message
        }`,
      );
    }
  },
};
