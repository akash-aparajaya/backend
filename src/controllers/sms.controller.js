import * as smsService from "../services/twilio.service.js";

export const sendSmsController = async (req, res) => {
  const { to, message } = req.body;

  if (!to || !message) {
    return res.status(400).json({
      success: false,
      message: "to and message are required"
    });
  }

  const result = await smsService.sendSMS(to, message);

  return res.json(result);
};
