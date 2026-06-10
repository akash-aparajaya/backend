import stripe from "./stripe.provider.js";
import razorpay from "./razorpay.provider.js";
import paypal from "./paypal.provider.js";
import payu from "./payu.provider.js";
import phonepe from "./phonepe.provider.js";
import ippopay from "./ippopay.provider.js";
import loanPaymentPro from "./loan-payment-pro.js";

export default {
  stripe,
  razorpay,
  paypal,
  payu,
  phonepe,
  ippopay,
  loan_payment_pro: loanPaymentPro,
};