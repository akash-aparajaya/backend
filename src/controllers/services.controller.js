import * as smsService from "../services/twilio.service.js";
import { successResponse, errorResponse } from "../utils/response.js";
import { smsQueue } from "../queues/sms.queue.js";


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
      apiKeyId:   req.apiKeyId
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
      message: "Missing fields",
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
      jobId: `${req.project.id}-${to}-${subject}`, // prevent duplicates
    }
  );

  return successResponse(res, null, "Email request queued successfully");
  } catch (error) {
    return errorResponse(res, "Failed to queue email request", error.message);
  }
};
