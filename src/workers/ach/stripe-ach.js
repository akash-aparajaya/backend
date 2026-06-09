// import Stripe from "stripe";

// export const stripeACHProvider = {
//   createCustomer: async (data, credentials) => {
//     const stripe = new Stripe(credentials.secret_key);

//     const customer = await stripe.customers.create({
//       name: `${data.first_name} ${data.last_name}`,
//       email: data.email,
//     });

//     return {
//       customerId: customer.id,
//     };
//   },

//   createPayment: async (data, credentials) => {
//     const stripe = new Stripe(credentials.secret_key);

//     const paymentIntent =
//       await stripe.paymentIntents.create({
//         amount: Math.round(data.amount * 100),
//         currency: "usd",
//         customer: data.customer_id,
//         payment_method_types: ["us_bank_account"],
//       });

//     return {
//       paymentId: paymentIntent.id,
//       status: paymentIntent.status,
//     };
//   },

//   getPayment: async (paymentId, credentials) => {
//     const stripe = new Stripe(credentials.secret_key);

//     return stripe.paymentIntents.retrieve(paymentId);
//   },

//   refundPayment: async (paymentId, data, credentials) => {
//     const stripe = new Stripe(credentials.secret_key);

//     return stripe.refunds.create({
//       payment_intent: paymentId,
//     });
//   },
// };