export const yodleeProvider = {
  start: async () => ({ requestId: "yodlee_1" }),
  status: async () => ({ status: "active" }),
  report: async () => ({ accounts: [] }),
  link: async () => ({ link: "yodlee_link" }),
};