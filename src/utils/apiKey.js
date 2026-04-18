import crypto from 'crypto';

export const generateGoogleStyleKey = async () => {
  const prefix = 'AIza';
  // Generate a 35-character random string using Base64Url charset
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let secret = '';
  
  // Create 35 random indices
  const randomBytes = crypto.randomBytes(35);
  for (let i = 0; i < 35; i++) {
    secret += charset.charAt(randomBytes[i] % charset.length);
  }

  const apiKey = `${prefix}${secret}`;

  // Hash for storage - NEVER store the raw key
  const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

  return {
    rawKey: apiKey,       // Display to user ONCE
    hashedKey: hashedKey, // Store in DB
    createdAt: new Date(),
    // Metadata usually stored in DB alongside the hashedKey:
    metadata: {
      restrictions: [],   // e.g., ['maps', 'vision']
      status: 'active'
    }
  };
};



/**
 * VERIFY KEY WITH RESTRICTIONS
 * @param {string} providedKey - The key from the request header
 * @param {Object} keyRecord - The document retrieved from your DB
 * @param {string} requiredService - The service the user is trying to access
 */
export const verifyApiKeyEnhanced = (providedKey, keyRecord, requiredService = null) => {
  if (!providedKey || !keyRecord) return { valid: false, reason: 'Missing key info' };

  // 1. Check if key is active
  if (keyRecord.status !== 'active') {
    return { valid: false, reason: 'Key is revoked or inactive' };
  }

  // 2. Hash and compare
  const hashedProvided = crypto.createHash('sha256').update(providedKey).digest('hex');
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(hashedProvided),
    Buffer.from(keyRecord.hashedKey)
  );

  if (!isMatch) return { valid: false, reason: 'Invalid API key' };

  // 3. Check Service Restrictions (Google-style)
  if (requiredService && keyRecord.restrictions.length > 0) {
    if (!keyRecord.restrictions.includes(requiredService)) {
      return { valid: false, reason: `Key not authorized for ${requiredService}` };
    }
  }

  return { valid: true };
};

/* DATABASE SCHEMA SUGGESTION (MongoDB/SQL):
  {
    userId: ObjectId,
    name: "Development Key",
    hashedKey: String,        // SHA-256 result
    lastFour: "Ab12",         // To show in UI so user knows which key it is
    restrictions: [String],   // ['gemini', 'translate']
    status: String,           // 'active', 'revoked'
    createdAt: Date
  }
*/