import {
  createApiKeyService,
  regenerateApiKeyService,
  getApiKeysService,
  deleteApiKeyService,
} from "../services/gitToken.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

/* -------- CREATE API KEY -------- */
export const createApiKeyController = async (req, res) => {
  try {
    const { project_id, environment_id, note, mode, expires_in_days } =
      req.body;
    const apiKey = await createApiKeyService(
      project_id,
      environment_id,
      note,
      mode,
      expires_in_days,
    );
    return successResponse(res, apiKey, "API key created successfully", 201);
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- REGENERATE API KEY -------- */
export const regenerateApiKeyController = async (req, res) => {
  try {
    const apiKeyId = req.params.id;

    const { note, expires_in_days } = req.body;

    const apiKey = await regenerateApiKeyService(
      apiKeyId,
      note,
      expires_in_days,
    );

    return successResponse(
      res,
      apiKey,
      "API key regenerated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- GET API KEYS -------- */
export const getApiKeysController = async (req, res) => {
  try {
    const project_id = req.query.project_id;
    const apiKeys = await getApiKeysService(project_id);

    return successResponse(res, apiKeys, "API keys fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- DELETE API KEY -------- */
export const deleteApiKeyController = async (req, res) => {
  try {
    const apiKeyId = req.params.id;

    await deleteApiKeyService(apiKeyId);

    return successResponse(res, null, "API key deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};
