import * as paymentGatewayService from "../services/paymentGateway.service.js";

/* ==========================================
   CUSTOMER
========================================== */

export const createPaymentGatewayCustomerController = async (
  req,
  res,
  next,
) => {
  try {
    const result = await paymentGatewayService.createPaymentGatewayCustomer(
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   PAYMENT METHOD
========================================== */

export const createPaymentGatewayPaymentMethodController = async (
  req,
  res,
  next,
) => {
  try {
    const result =
      await paymentGatewayService.createPaymentGatewayPaymentMethod(req.body);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   PAYMENT
========================================== */

export const createPaymentGatewayPaymentController = async (req, res, next) => {
  try {
    const result = await paymentGatewayService.createPaymentGatewayPayment(
      req.body,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getPaymentGatewayPaymentController = async (req, res, next) => {
  try {
    const result = await paymentGatewayService.getPaymentGatewayPayment(
      req.params.paymentId,
      req.query.provider,
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   REFUND
========================================== */

export const refundPaymentGatewayPaymentController = async (req, res, next) => {
  try {
    const result = await paymentGatewayService.refundPaymentGatewayPayment({
      paymentId: req.params.paymentId,
      ...req.body,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
