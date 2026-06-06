import crypto from "crypto";
import prisma from "../config/prisma.js";

/* -------- CREATE API KEY -------- */
export const createApiKeyService = async (
  project_id,
  environment_id,
  note,
  mode,
  expires_in_days,
) => {
  // check duplicate
  const existingKey = await prisma.apiKeys.findFirst({
    where: {
      project_id,
      environment_id,
      mode,
      is_active: true,
      is_deleted: false,
    },
  });

  if (existingKey) {
    throw {
      message: "API key already exists",
      statusCode: 400,
    };
  }

  // generate unpredictable key
  const randomKey = crypto.randomBytes(32).toString("hex");
  const randomPrefix = crypto.randomBytes(3).toString("hex"); // e.g "a3f9b2"
  const apiKey = `${randomPrefix}_${randomKey}`;

  // hash before storing
  const hashedKey = crypto.createHash("sha256").update(apiKey).digest("hex");

  // calculate expiry date
  const expires_at = expires_in_days
    ? new Date(Date.now() + expires_in_days * 86400000)
    : null;

  // save to DB
  const createdApiKey = await prisma.apiKeys.create({
    data: {
      project_id,
      environment_id,
      note,
      api_key: hashedKey,
      prefix: randomPrefix,
      mode,
      expires_in_days: expires_in_days ?? null,
      expires_at,
      last_used_at: null,
      is_active: true,
      is_deleted: false,
    },
  });

  return { ...createdApiKey, key: apiKey }; // return createdApiKey;
};

/* -------- REGENERATE API KEY -------- */
export const regenerateApiKeyService = async (
  apiKeyId,
  note,
  expires_in_days,
) => {
  const existingApiKey = await prisma.apiKeys.findFirst({
    where: {
      public_id: apiKeyId,
      is_deleted: false,
    },
  });

  if (!existingApiKey) {
    throw {
      message: "API key not found",
      statusCode: 404,
    };
  }

  const randomPrefix = crypto.randomBytes(3).toString("hex");
  const randomKey = crypto.randomBytes(32).toString("hex");
  const newRawKey = `${randomPrefix}_${randomKey}`;

  const hashedKey = crypto.createHash("sha256").update(newRawKey).digest("hex");

  const expires_at = expires_in_days
    ? new Date(Date.now() + expires_in_days * 86400000)
    : null;

  const updatedApiKey = await prisma.apiKeys.update({
    where: { public_id: apiKeyId },
    data: {
      api_key: hashedKey,
      note,
      expires_in_days,
      expires_at,
      last_used_at: null,
      updated_at: new Date(),
    },
  });

  return {
    ...updatedApiKey,
    public_id: existingApiKey.public_id,
    key: newRawKey,
  };
};

/* -------- GET API KEYS -------- */
export const getApiKeysService = async (project_id) => {
  const apiKeys = await prisma.apiKeys.findMany({
    where: {
      project_id,
      is_deleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  if (!apiKeys) {
    throw {
      message: "API keys not found for this project",
      statusCode: 400,
    };
  }

  return apiKeys;
};

/* -------- DELETE API KEY -------- */
export const deleteApiKeyService = async (apiKeyId) => {
  const existingApiKey = await prisma.apiKeys.findFirst({
    where: {
      public_id: apiKeyId,
      is_deleted: false,
    },
  });

  if (!existingApiKey) {
    throw {
      message: "API key not found",
      statusCode: 404,
    };
  }

  await prisma.apiKeys.update({
    where: {
      public_id: apiKeyId,
    },
    data: {
      is_deleted: true,
      is_active: false,
    },
  });

  return true;
};
