import nodemailer from "nodemailer";
import axios from "axios";

// =============================================================================
// SMTP
// =============================================================================

const sendViaSMTP = async ({ to, subject, message, credentials }) => {
  const transporter = nodemailer.createTransport({
    host: credentials.host,
    port: Number(credentials.port),
    secure: credentials.secure || false,
    auth: {
      user: credentials.username,
      pass: credentials.password,
    },
  });

  return await transporter.sendMail({
    from: credentials.from_email,
    to,
    subject,
    html: message,
  });
};

// =============================================================================
// SENDGRID
// =============================================================================

const sendViaSendGrid = async ({ to, subject, message, credentials }) => {
  const response = await axios.post(
    "https://api.sendgrid.com/v3/mail/send",
    {
      personalizations: [
        {
          to: [{ email: to }],
        },
      ],
      from: {
        email: credentials.from_email,
      },
      subject,
      content: [
        {
          type: "text/html",
          value: message,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${credentials.api_key}`,
        "Content-Type": "application/json",
      },
    },
  );

  return {
    success: true,
    provider: "send grid",
    status: response.status,
    statusText: response.statusText,
    messageId: response.headers["x-message-id"] || null,
    acceptedAt: new Date().toISOString(),
    recipient: to,
    subject,
  };
};

// =============================================================================
// BREVO (SENDINBLUE)
// =============================================================================

const sendViaBrevo = async ({ to, subject, message, credentials }) => {
  const response = await axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: {
        email: credentials.from_email,
      },
      to: [
        {
          email: to,
        },
      ],
      subject,
      htmlContent: message,
    },
    {
      headers: {
        "api-key": credentials.api_key,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// =============================================================================
// RESEND
// =============================================================================

const sendViaResend = async ({ to, subject, message, credentials }) => {
  const response = await axios.post(
    "https://api.resend.com/emails",
    {
      from: credentials.from_email,
      to,
      subject,
      html: message,
    },
    {
      headers: {
        Authorization: `Bearer ${credentials.api_key}`,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// =============================================================================
// POSTMARK
// =============================================================================

const sendViaPostmark = async ({ to, subject, message, credentials }) => {
  const response = await axios.post(
    "https://api.postmarkapp.com/email",
    {
      From: credentials.from_email,
      To: to,
      Subject: subject,
      HtmlBody: message,
    },
    {
      headers: {
        "X-Postmark-Server-Token": credentials.server_token,
        "Content-Type": "application/json",
      },
    },
  );

  return response.data;
};

// =============================================================================
// MAILGUN
// =============================================================================

const sendViaMailgun = async ({ to, subject, message, credentials }) => {
  const form = new URLSearchParams();

  form.append("from", credentials.from_email);
  form.append("to", to);
  form.append("subject", subject);
  form.append("html", message);

  const response = await axios.post(
    `https://api.mailgun.net/v3/${credentials.domain}/messages`,
    form,
    {
      auth: {
        username: "api",
        password: credentials.api_key,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return response.data;
};

// =============================================================================
// AWS SES
// =============================================================================

const sendViaSES = async ({ to, subject, message, credentials }) => {
  throw new Error("AWS SES implementation pending");
};

// =============================================================================
// PROVIDER MAP
// =============================================================================

const PROVIDER_MAP = {
  smtp: sendViaSMTP,
  sendgrid: sendViaSendGrid,
  aws_ses: sendViaSES,
  mailgun: sendViaMailgun,
  postmark: sendViaPostmark,
  resend: sendViaResend,
  brevo: sendViaBrevo,
};

// =============================================================================
// MAIN FUNCTION
// =============================================================================

export const sendEmailProvider = async ({ to, subject, message, provider }) => {
  const senderFn = PROVIDER_MAP[provider.provider_slug];

  if (!senderFn) {
    throw new Error(`Unsupported Email Provider: ${provider.provider_slug}`);
  }

  try {
    const result = await senderFn({
      to,
      subject,
      message,
      credentials: provider.credentials,
    });

    console.log(`Email sent via ${provider.provider_slug} to ${to}`);

    return result;
  } catch (error) {
    const errMsg = error?.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;

    throw new Error(`[${provider.provider_slug}] ${errMsg}`);
  }
};
