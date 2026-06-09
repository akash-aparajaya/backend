import * as createQueues from "../queues/service.queue.js";

/* -------- send sm queue controller -------- */
export const sendSmsController = async (req, res) => {
  try {
    const data = req.body;

    const PRIORITY_MAP = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

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
      "priority",
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
        priority: data.priority,
        priority_value: PRIORITY_MAP[data.priority],
        scheduled_at: new Date().toISOString(),
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
    const data = req.body;

    const PRIORITY_MAP = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1,
    };

    const context = {
      project_id: req.project_id,
      environment_id: req.environment_id,
      provider_id: req.provider_id,
      api_key: req.apiKey,
      mode: req.mode,
    };

    // VALIDATION
    const requiredFields = [
      "type",
      "message",
      "recipient",
      "idempotency_key",
      "priority",
    ];

    const missingFields = requiredFields.filter((field) => !data[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing fields: ${missingFields.join(", ")}`,
      });
    }

    if (!PRIORITY_MAP[data.priority]) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid priority. Allowed values: CRITICAL, HIGH, MEDIUM, LOW",
      });
    }

    try {
      const job = await createQueues.createEmailQueueService({
        type: data.type,

        recipient: data.recipient,
        subject: data.subject ?? null,
        message: data.message,

        template_name: data.template_name ?? null,

        idempotency_key: data.idempotency_key,

        project_id: context.project_id,
        environment_id: context.environment_id,
        provider_id: context.provider_id,

        mode: context.mode,

        request_payload: data,

        priority: data.priority,
        priority_value: PRIORITY_MAP[data.priority],
        scheduled_at: new Date(),
      });

      return res.status(201).json({
        success: true,
        message: "Email queued successfully",
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

    await createQueues.createWhatsappQueueService({
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

/* -------- IBV controller -------- */
// export const sendIBVController = async (req, res) => {
//   try {

//     const context = {
//       project_id: req.project_id,
//       environment_id: req.environment_id,
//       mode: req.mode,
//     };

//     const result = await ibvWorker.verify(req.body, context);

//     return res.status(200).json({
//       success: true,
//       data: result,
//       message: "IBV queued successfully",
//     });
//   } catch (error) {
//     console.error("IBV Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message || "Failed to process IBV request",
//     });
//   }
// };

/* -------- Credit Score controller -------- */
export const sendCreditScoreController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Credit Score queued successfully",
  });
};

/* -------- Payment Gateway controller -------- */
export const sendPaymentGatewayController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Payment Gateway queued successfully",
  });
};

/* -------- ACH controller -------- */
export const sendACHController = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: "ACH queued successfully",
  });
};
