import { successResponse, errorResponse } from "../utils/response.js";
import * as providersService from "../services/providers.service.js";
import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import { unlockServiceCredentials } from "../services/providers.service.js";

/* -------- get all Services -------- */
export const getAllServicesController = async (req, res) => {
  try {
    const services = await providersService.getAllServices(
      req.query.environment_id,
    );
    return successResponse(res, services, "Services fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
    return errorResponse(res, err.message, null, err.statusCode || 500);
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- get provider by id -------- */
export const getProviderByIdController = async (req, res) => {
  try {
    const provider = await providersService.getProviderById(req.params.id);
    return successResponse(res, provider, "Provider fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
      provider_name,
      mode,
      provider_slug,
    } = req.body;
    const provider = await providersService.assignProviderToEnvironment({
      environment_id,
      service_type_id,
      provider_id,
      credentials,
      provider_name,
      mode,
      provider_slug,
    });
    return successResponse(res, provider, "Provider created successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- update provider -------- */
export const updateProviderController = async (req, res) => {
  try {
    const { id, credentials, is_active } = req.body;

    const provider = await providersService.updateProviderInEnvironment({
      id,
      credentials,
      is_active,
    });

    return successResponse(res, provider, "Provider updated successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
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
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- reveal provider credentials -------- */
export const revealProviderCredentials = async (req, res) => {
  try {
    const getProvider = await providersService.revealProvider(req.params.id);

    return successResponse(res, getProvider, "Provider fetched successfully");
  } catch (error) {
    return errorResponse(res, error.message, null, error.statusCode || 500);
  }
};

/* -------- unlock service credentials -------- */
export const unlockServiceController = async (req, res) => {
  try {
    const { environment_id, service_type_id, credentialPasskey } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        public_id: req.user.id,
      },
    });

    if (!user) {
      return errorResponse(res, "User not found");
    }

    if (!user.credential_passkey) {
      return errorResponse(res, "Credential passkey not configured");
    }

    const isValid = await bcrypt.compare(
      credentialPasskey,
      user.credential_passkey,
    );

    if (!isValid) {
      return errorResponse(res, "Invalid passkey");
    }

    const data = await unlockServiceCredentials({
      environmentId: environment_id,
      serviceId: service_type_id,
    });

    return successResponse(
      res,
      {
        expiresIn: 60,
        ...data,
      },
      "Credentials unlocked",
    );
  } catch (error) {
    console.error("UNLOCK ERROR >>>", error);
    return errorResponse(res, "Failed to unlock credentials", error.message);
  }
};
