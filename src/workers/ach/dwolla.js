import axios from "axios";

export const dwollaProvider = {
  createCustomer: async (data, credentials) => {
    // OAuth Token
    // Create Customer
  },

  createPaymentMethod: async (data, credentials) => {
    // Create Funding Source
  },

  createPayment: async (data, credentials) => {
    // Create Transfer
  },

  getPayment: async (paymentId, credentials) => {
    // Get Transfer
  },

  refundPayment: async () => {
    throw new Error(
      "Refund not directly supported by Dwolla",
    );
  },
};