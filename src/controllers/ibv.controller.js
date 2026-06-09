import * as ibvService from "../services/ibv.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

export const startIBVController = async (req, res) => {
  try {
    const { project_id, environment_id, mode } = req;
    const { provider_slug, first_name, last_name, email, phone } = req.body;

    const result = await ibvService.startIBV(
      { provider_slug, first_name, last_name, email, phone },
      { project_id, environment_id, mode },
    );
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getIBVStatusController = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { project_id, environment_id, mode } = req;

    const result = await ibvService.getStatus(requestId, {
      project_id,
      environment_id,
      mode,
    });
    return successResponse(res, result, "IBV status fetched successfully");
  } catch (err) {
    return errorResponse(res, err.message, null, err.statusCode || 500);
  }
};

export const getIBVReportController = async (req, res) => {
  try {
    const { project_id, environment_id, mode } = req;
    const { requestId } = req.params;
    const result = await ibvService.getReport(requestId, {
      project_id,
      environment_id,
      mode,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateLinkController = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { project_id, environment_id, mode } = req;

    const result = await ibvService.generateChirpLink(requestId, {
      project_id,
      environment_id,
      mode,
    });

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

export const cancelRequestController = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { project_id, environment_id, mode } = req;

    const result = await ibvService.cancelIBV(requestId, {
      project_id,
      environment_id,
      mode,
    });
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
