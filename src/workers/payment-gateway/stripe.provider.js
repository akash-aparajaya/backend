import Stripe from "stripe";

const getStripeClient = (credentials) => {
  return new Stripe(credentials.secret_key);
};

export default {
  /* ==========================================
     CUSTOMER
  ========================================== */

  createCustomer: async (data, credentials) => {
    try {
      const stripe = getStripeClient(credentials);

      const customer = await stripe.customers.create({
        name: data.name,
        email: data.email,
        phone: data.phone,
      });

      return {
        customerId: customer.id,
        response: customer,
      };
    } catch (err) {
      throw new Error(`Stripe createCustomer failed: ${err.message}`);
    }
  },

  /* ==========================================
     PAYMENT METHOD
  ========================================== */

  createPaymentMethod: async (data, credentials) => {
    try {
      const stripe = getStripeClient(credentials);

      const paymentMethod = await stripe.paymentMethods.create({
        type: "card",
        card: {
          number: data.card_number,
          exp_month: data.exp_month,
          exp_year: data.exp_year,
          cvc: data.cvc,
        },
      });

      return {
        paymentMethodId: paymentMethod.id,
        response: paymentMethod,
      };
    } catch (err) {
      throw new Error(`Stripe createPaymentMethod failed: ${err.message}`);
    }
  },

  /* ==========================================
     PAYMENT
  ========================================== */

  createPayment: async (data, credentials) => {
    try {
      const stripe = getStripeClient(credentials);

      const intent = await stripe.paymentIntents.create({
        amount: Math.round(Number(data.amount) * 100),
        currency: data.currency || "usd",
        customer: data.customer_id,
        payment_method: data.payment_method_id,
        confirm: true,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: "never",
        },
      });

      return {
        paymentId: intent.id,
        status: intent.status,
        response: intent,
      };
    } catch (err) {
      throw new Error(`Stripe createPayment failed: ${err.message}`);
    }
  },

  /* ==========================================
     GET PAYMENT
  ========================================== */

  getPayment: async (paymentId, credentials) => {
    try {
      const stripe = getStripeClient(credentials);

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);

      return {
        paymentId: paymentIntent.id,
        status: paymentIntent.status,
        response: paymentIntent,
      };
    } catch (err) {
      throw new Error(`Stripe getPayment failed: ${err.message}`);
    }
  },

  /* ==========================================
     REFUND
  ========================================== */

  refundPayment: async (paymentId, amount, credentials) => {
    try {
      const stripe = getStripeClient(credentials);

      const refund = await stripe.refunds.create({
        payment_intent: paymentId,
        ...(amount && {
          amount: Math.round(Number(amount) * 100),
        }),
      });

      return {
        refundId: refund.id,
        status: refund.status,
        response: refund,
      };
    } catch (err) {
      throw new Error(`Stripe refundPayment failed: ${err.message}`);
    }
  },
};
