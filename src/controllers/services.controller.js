import * as smsService from "../services/twilio.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
// import { smsQueue } from "../queues/sms.queue.js";
// import { emailQueue } from "../queues/email.queue.js";
import * as providersService from "../services/providers.service.js";
import * as createQueues from "../queues/service.queue.js";

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

/* -------- send sm queue controller -------- */
export const sendSmsController = async (req, res) => {
  try {
    const data = req.body;

    const context = {
      project_id: req.project_id,
      environment_id: req.environment_id,
      api_key: req.apiKey,
      mode: req.mode,
    };

    // 1. VALIDATION
    const requiredFields = [
      "type",
      "message",
      "recipient",
      "idempotency_key",
      "template_name",
    ];

    const missingFields = requiredFields.filter((f) => !data[f]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    // 2. CREATE JOB (SAFE - NO PRE CHECK)
    try {
      const job = await createQueues.createSmsQueueService({
        type: data.type,
        message: data.message,
        recipient: data.recipient,
        template_name: data.template_name ?? null,
        idempotency_key: data.idempotency_key,
        project_id: context.project_id,
        environment_id: context.environment_id,
        mode: context.mode,
        request_payload: data,
      });

      return res.status(201).json({
        success: true,
        message: "SMS queued successfully",
        data: job,
      });
    } catch (err) {
      if (err.code === "P2002") {
        return res.status(200).json({
          success: true,
          message: "Request already processed",
        });
      }

      throw err;
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* -------- send email queue controller -------- */
export const sendEmailController = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const data = req.body;

    const context = await apiKeyService.resolve(apiKey);

    if (!context) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key",
      });
    }

    await createQueues.createEmailQueueService({
      ...data,

      project_id: context.project_id,
      environment_id: context.environment_id,
      provider_id: context.provider_id,
      mode: context.mode,
    });

    return res.status(201).json({
      success: true,
      message: "Email queued successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* -------- send whatsapp queue controller -------- */
export const sendWhatsAppController = async (req, res) => {
  try {
    const apiKey = req.headers["x-api-key"];
    const data = req.body;

    const context = await apiKeyService.resolve(apiKey);

    if (!context) {
      return res.status(401).json({
        success: false,
        message: "Invalid API key",
      });
    }

    await createQueues.createWhatsAppQueueService({
      ...data,

      project_id: context.project_id,
      environment_id: context.environment_id,
      provider_id: context.provider_id,
      mode: context.mode,
    });

    return res.status(201).json({
      success: true,
      message: "WhatsApp queued successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
