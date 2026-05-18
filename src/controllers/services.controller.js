import * as smsService from "../services/twilio.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { smsQueue } from "../queues/sms.queue.js";
import { emailQueue } from "../queues/email.queue.js";
import * as providersService from "../services/providers.service.js";

export const getAllServicesController = async (req, res) => {
  try {
    const services = await providersService.getAllServices();
    return successResponse(res, services, "Services fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch services", error.message);
  }
};
export const getAllProvidersController = async (req, res) => {
  try {
    const providers = await providersService.getAllProviders();
    return successResponse(res, providers, "Providers fetched successfully");
  } catch (error) {
    return errorResponse(res, "Failed to fetch providers", error.message);
  }
};

export const sendSmsController = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({
        success: false,
        message: "to and message required",
      });
    }

    await smsQueue.add("send-sms", {
      to,
      message,
      projectId: req.project.id,
      apiKeyId: req.apiKeyId,
    });

    return successResponse(res, null, "SMS request queued successfully");
  } catch (error) {
    return errorResponse(res, "Failed to queue SMS request", error.message);
  }
};

export const sendEmailController = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "to, subject and message required",
      });
    }

    await emailQueue.add(
      "send-email",
      {
        to,
        subject,
        message,
        projectId: req.project.id,
      },
      {
        jobId: `${req.project.id}-${to}-${subject}-${message}`, // prevent duplicates
      },
    );

    return successResponse(res, null, "Email request queued successfully");
  } catch (error) {
    return errorResponse(res, "Failed to queue email request", error.message);
  }
};
