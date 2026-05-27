import crypto from "crypto";
import prisma from "../config/prisma.js";
import e from "express";

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
    throw new Error(`${mode} API key already exists`);
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

export const regenerateApiKeyService = async (apiKeyId) => {
  // find existing key
  const existingApiKey = await prisma.apiKeys.findFirst({
    where: {
      public_id: apiKeyId,
      is_deleted: false,
    },
  });

  if (!existingApiKey) {
    throw new Error("API key not found");
  }

  // generate new unpredictable key
  const randomPrefix = crypto.randomBytes(3).toString("hex"); // e.g "a3f9b2"
  const randomKey = crypto.randomBytes(32).toString("hex");
  const newRawKey = `${randomPrefix}_${randomKey}`;

  // hash before storing
  const hashedKey = crypto.createHash("sha256").update(newRawKey).digest("hex");

  // recalculate expiry if exists
  const expires_at = existingApiKey.expires_in_days
    ? new Date(Date.now() + existingApiKey.expires_in_days * 86400000)
    : null;

  // update DB with new hash
  const updatedApiKey = await prisma.apiKeys.update({
    where: { public_id: apiKeyId },
    data: {
      api_key: hashedKey,
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

export const getApiKeysService = async () => {
  const apiKeys = await prisma.apiKeys.findMany({
    where: {
      is_deleted: false,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return apiKeys;
};

export const deleteApiKeyService = async (apiKeyId) => {
  const existingApiKey = await prisma.apiKeys.findFirst({
    where: {
      public_id: apiKeyId,
      is_deleted: false,
    },
  });

  if (!existingApiKey) {
    throw new Error("API key not found");
  }

  await prisma.apiKeys.updateMany({
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
