export const plaidProvider = {
  start: async () => ({ requestId: "plaid_1" }),
  status: async () => ({ status: "active" }),
  report: async () => ({ accounts: [] }),
  link: async () => ({ link: "plaid_link" }),
};