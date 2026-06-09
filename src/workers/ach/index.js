import { loanPaymentProProvider } from "./loan-payment-pro.js";
import { dwollaProvider } from "./dwolla.js";
// import { stripeACHProvider } from "./stripe-ach.js";
// import { squareProvider } from "./square.js";

export const providers = {
  loan_payment_pro: loanPaymentProProvider,
  dwolla: dwollaProvider,
//   stripe_ach: stripeACHProvider,
//   square: squareProvider,
};
