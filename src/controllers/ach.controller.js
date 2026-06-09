import * as achService from "../services/ach.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const createACHCustomerController = async (req, res) => {
  try {
    const { project_id, environment_id, mode } = req;
    const { provider_slug, ...payload } = req.body;

    const result = await achService.createCustomer(
      { provider_slug, ...payload },
      { project_id, environment_id, mode },
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createACHPaymentMethodController = async (req, res) => {
  try {
    const { project_id, environment_id, mode } = req;
    const { provider_slug, ...payload } = req.body;

    const result = await achService.createPaymentMethod(
      { provider_slug, ...payload },
      { project_id, environment_id, mode },
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const createACHPaymentController = async (req, res) => {
  try {
    const { project_id, environment_id, mode } = req;
    const { provider_slug, ...payload } = req.body;

    const result = await achService.createPayment(
      { provider_slug, ...payload },
      { project_id, environment_id, mode },
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getACHPaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { project_id, environment_id, mode } = req;

    const result = await achService.getPayment(paymentId, {
      project_id,
      environment_id,
      mode,
    });

    return successResponse(
      res,
      result,
      "Payment fetched successfully",
    );
  } catch (err) {
    return errorResponse(
      res,
      err.message,
      null,
      err.statusCode || 500,
    );
  }
};

export const refundACHPaymentController = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { project_id, environment_id, mode } = req;

    const result = await achService.refundPayment(
      paymentId,
      req.body,
      {
        project_id,
        environment_id,
        mode,
      },
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};