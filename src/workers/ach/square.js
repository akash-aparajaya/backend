// import { Client } from "square";

// export const squareProvider = {
//   createCustomer: async (data, credentials) => {
//     const client = new Client({
//       accessToken: credentials.access_token,
//     });

//     const result =
//       await client.customersApi.createCustomer({
//         givenName: data.first_name,
//         familyName: data.last_name,
//         emailAddress: data.email,
//       });

//     return {
//       customerId: result.result.customer.id,
//     };
//   },

//   createPayment: async (data, credentials) => {
//     const client = new Client({
//       accessToken: credentials.access_token,
//     });

//     const result =
//       await client.paymentsApi.createPayment({
//         sourceId: data.source_id,
//         idempotencyKey: crypto.randomUUID(),
//         amountMoney: {
//           amount: Math.round(data.amount * 100),
//           currency: "USD",
//         },
//       });

//     return {
//       paymentId: result.result.payment.id,
//       status: result.result.payment.status,
//     };
//   },

//   getPayment: async (paymentId, credentials) => {
//     const client = new Client({
//       accessToken: credentials.access_token,
//     });

//     return client.paymentsApi.getPayment(paymentId);
//   },
// };