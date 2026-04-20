export const SERVICE_CONFIG = {
  SMS: {
    endpoint: "/api/services/send-sms",
    method: "POST",
  },
  EMAIL: {
    endpoint: "/api/services/send-email",
    method: "POST",
  },
  SMTP: {
    endpoint: "/api/smtp/send",
    method: "POST",
  },
  WHATSAPP: {
    endpoint: "/api/whatsapp/send",
    method: "POST",
  },
  PUSH: {
    endpoint: "/api/push/send",
    method: "POST",
  },
};