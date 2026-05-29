import * as smsService from "../services/twilio.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
// import { smsQueue } from "../queues/sms.queue.js";
// import { emailQueue } from "../queues/email.queue.js";
import * as providersService from "../services/providers.service.js";

/* -------- get all Services -------- */
export const getAllServicesController = async (req, res) => {
  try {
    const services = await providersService.getAllServices();
    return successResponse(res, services, "Services fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch services", error.message);
  }
};

/* -------- get providers by environment id -------- */
export const getProvidersByEnvironmentIdController = async (req, res) => {
  try {
    const providers = await providersService.getProvidersByEnvironmentId(
      req.params.id,
      req.query.services_type_id,
    );
    return successResponse(res, providers, "Providers fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch providers", error.message);
  }
};

/* -------- get providers by service id -------- */
export const getProvidersByServiceIdController = async (req, res) => {
  try {
    const providers = await providersService.getProvidersByServiceId(
      req.params.id,
    );
    return successResponse(res, providers, "Providers fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch providers", error.message);
  }
};

/* -------- get provider by id -------- */
export const getProviderByIdController = async (req, res) => {
  try {
    const provider = await providersService.getProviderById(req.params.id);
    return successResponse(res, provider, "Provider fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch provider", error.message);
  }
};

/* -------- create provider -------- */
export const createProviderController = async (req, res) => {
  try {
    const {
      environment_id,
      service_type_id,
      provider_id,
      credentials,
      endpoint,
      provider_name,
      mode,
    } = req.body;
    const provider = await providersService.assignProviderToEnvironment({
      environment_id,
      service_type_id,
      provider_id,
      credentials,
      endpoint,
      provider_name,
      mode,
    });
    return successResponse(res, provider, "Provider created successfully");
  } catch (error) {
    return errorResponse(res, "Failed to create provider", error.message);
  }
};

/* -------- update provider -------- */
export const updateProviderController = async (req, res) => {
  try {
    const { id, credentials } = req.body;
    const provider = await providersService.updateProviderInEnvironment({
      id,
      credentials,
    });
    return successResponse(res, provider, "Provider updated successfully");
  } catch (error) {
    return errorResponse(res, "Failed to update provider", error.message);
  }
};

/* -------- delete provider -------- */
export const deleteProviderController = async (req, res) => {
  try {
    const provider = await providersService.deleteProviderFromEnvironment(
      req.params.id,
    );
    return successResponse(res, provider, "Provider deleted successfully");
  } catch (error) {
    return errorResponse(res, "Failed to delete provider", error.message);
  }
};

