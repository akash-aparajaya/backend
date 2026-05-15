import {
  createApiKeyService,
  regenerateApiKeyService,
  getApiKeysService,
  deleteApiKeyService,
} from "../services/gitToken.service.js";
import { successResponse, errorResponse } from "../utils/response.js";

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
    return errorResponse(res, "Failed to create API key", error.message);
  }
};

export const regenerateApiKeyController = async (req, res) => {
  try {
    const apiKeyId = req.params.id;

    const apiKey = await regenerateApiKeyService(apiKeyId);

    return successResponse(
      res,
      apiKey,
      "API key regenerated successfully",
      200,
    );
  } catch (error) {
    return errorResponse(res, "Failed to regenerate API key", error.message);
  }
};

export const getApiKeysController = async (req, res) => {
  try {
    const apiKeys = await getApiKeysService();

    return successResponse(res, apiKeys, "API keys fetched successfully", 200);
  } catch (error) {
    return errorResponse(res, "Failed to fetch API keys", error.message);
  }
};

export const deleteApiKeyController = async (req, res) => {
  try {
    const apiKeyId = req.params.id;

    await deleteApiKeyService(apiKeyId);

    return successResponse(res, null, "API key deleted successfully", 200);
  } catch (error) {
    return errorResponse(res, "Failed to delete API key", error.message);
  }
};
