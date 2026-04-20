import crypto from 'crypto';

// 🔑 Generate API Key
export const generateApiKey = (service) => {
  const prefixMap = {
    SMS: "sms_",
    EMAIL: "email_",
  };

  const prefix = prefixMap[service] || "key_";

  const secret = crypto.randomBytes(32).toString("base64url");

  const rawKey = `${prefix}${secret}`;

  const keyHash = crypto
    .createHash("sha256")
    .update(rawKey)
    .digest("hex");

  return {
    rawKey,
    keyHash,
    lastFour: rawKey.slice(-4),
  };
};
// 🔐 Verify API Key
export const verifyApiKeyEnhanced = (
  providedKey,
  keyRecord,
  requiredService = null
) => {
  if (!providedKey || !keyRecord) {
    return { valid: false, reason: 'Missing key info' };
  }

  if (keyRecord.status !== 'active') {
    return { valid: false, reason: 'Key is revoked or inactive' };
  }

  const hashedProvided = crypto
    .createHash('sha256')
    .update(providedKey)
    .digest('hex');

  if (hashedProvided.length !== keyRecord.hashedKey.length) {
    return { valid: false, reason: 'Invalid API key' };
  }

  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedProvided),
    Buffer.from(keyRecord.hashedKey)
  );

  if (!isMatch) {
    return { valid: false, reason: 'Invalid API key' };
  }

  const restrictions = keyRecord.restrictions || [];

  if (requiredService && restrictions.length > 0) {
    if (!restrictions.includes(requiredService)) {
      return {
        valid: false,
        reason: `Key not authorized for ${requiredService}`,
      };
    }
  }

  return { valid: true };
};