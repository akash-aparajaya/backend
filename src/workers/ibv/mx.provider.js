export const mxProvider = {
  start: async () => ({ requestId: "mx_1" }),
  status: async () => ({ status: "active" }),
  report: async () => ({ accounts: [] }),
  link: async () => ({ link: "mx_link" }),
};