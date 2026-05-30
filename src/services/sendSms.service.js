import twilio from "twilio";
import { SinchClient } from "@sinch/sdk-core";
import axios from "axios";

// =============================================================================
// INDIVIDUAL PROVIDER SENDERS
// =============================================================================

// TWILIO — official SDK (clean, no vulnerabilities)
const sendViaTwilio = async ({ to, message, credentials }) => {
  const { account_sid, auth_token, phone_number } = credentials;

  const client = twilio(account_sid, auth_token);

  const result = await client.messages.create({
    body: message,
    from: phone_number,
    to,
  });

  return result;
};

// -----------------------------------------------------------------------------

// MSG91 — axios (msg91-sdk removed, uses deprecated request lib)
const sendViaMSG91 = async ({ to, message, credentials }) => {
  const { api_key, sender_id, template_id } = credentials;

  const response = await axios.post(
    "https://api.msg91.com/api/v5/flow",
    {
      template_id,
      sender: sender_id,
      mobiles: to,
      body: message,
    },
    {
      headers: {
        authkey: api_key,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// -----------------------------------------------------------------------------

// VONAGE — axios (@vonage/server-sdk removed, vulnerable uuid chain)
const sendViaVonage = async ({ to, message, credentials }) => {
  const { api_key, api_secret, from_number } = credentials;

  const response = await axios.post(
    "https://rest.nexmo.com/sms/json",
    {
      api_key,
      api_secret,
      to,
      from: from_number,
      text: message,
    },
    {
      headers: { "Content-Type": "application/json" },
    }
  );

  // Vonage returns 200 even on failure — manually check message status
  const msg = response.data?.messages?.[0];
  if (!msg || msg.status !== "0") {
    throw new Error(`Vonage error: ${msg?.["error-text"] || "Unknown error"}`);
  }

  return response.data;
};

// -----------------------------------------------------------------------------

// PLIVO — axios (plivo SDK removed, pulls in vulnerable request lib)
const sendViaPlivo = async ({ to, message, credentials }) => {
  const { auth_id, auth_token, src } = credentials;

  const response = await axios.post(
    `https://api.plivo.com/v1/Account/${auth_id}/Message/`,
    {
      src,
      dst: to,
      text: message,
    },
    {
      auth: {
        username: auth_id,
        password: auth_token,
      },
      headers: { "Content-Type": "application/json" },
    }
  );

  return response.data;
};

// -----------------------------------------------------------------------------

// TELNYX — official SDK (clean, no vulnerabilities)
const sendViaTelnyx = async ({ to, message, credentials }) => {
  const { api_key, from_number } = credentials;

  const response = await axios.post(
    "https://api.telnyx.com/v2/messages",
    {
      from: from_number,
      to,
      text: message,
    },
    {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// -----------------------------------------------------------------------------

// SINCH — official SDK (clean, no vulnerabilities)
const sendViaSinch = async ({ to, message, credentials }) => {
  const { project_id, access_key, sender_id } = credentials;

  const client = new SinchClient({
    projectId: project_id,
    keyId: access_key,
    keySecret: access_key,
  });

  const result = await client.sms.batches.send({
    sendSmsBatchRequest: {
      from: sender_id,
      to: [to],
      body: message,
    },
  });

  return result;
};

// -----------------------------------------------------------------------------

// TRUEDIALOG — axios (no official SDK available)
const sendViaTrueDialog = async ({ to, message, credentials }) => {
  const { api_key, sender_id } = credentials;

  const response = await axios.post(
    "https://api.truedialog.com/api/v2/send",
    {
      from: sender_id,
      to,
      body: message,
    },
    {
      headers: {
        Authorization: `Bearer ${api_key}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// =============================================================================
// PROVIDER MAP
// =============================================================================

const PROVIDER_MAP = {
  twilio_sms: sendViaTwilio,
  msg91: sendViaMSG91,
  vonage_sms: sendViaVonage,
  plivo: sendViaPlivo,
  telnyx_sms: sendViaTelnyx,
  sinch_sms: sendViaSinch,
  truedialog_sms: sendViaTrueDialog,
};

// =============================================================================
// MAIN FUNCTION — called from smsWorker
// =============================================================================

/**
 * sendSmsProvider
 * @param {string} to        - recipient phone number (E.164 format)
 * @param {string} message   - SMS message body
 * @param {object} provider  - provider object from DB { provider_slug, credentials }
 */
export const sendSmsProvider = async ({ to, message, provider }) => {
  const senderFn = PROVIDER_MAP[provider.provider_slug];

  if (!senderFn) {
    throw new Error(`Unsupported SMS provider: ${provider.provider_slug}`);
  }

  try {
    const result = await senderFn({
      to,
      message,
      credentials: provider.credentials,
    });

    console.log(`SMS sent via ${provider.provider_slug} to ${to}`);
    return result;
  } catch (error) {
    const errMsg = error?.response?.data
      ? JSON.stringify(error.response.data)
      : error.message;

    throw new Error(`[${provider.provider_slug}] ${errMsg}`);
  }
};