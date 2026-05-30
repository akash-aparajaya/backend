import crypto from "crypto";
import prisma from "../config/prisma.js";

export const validateApiKey = async (req, res, next) => {
  try {
    const rawKey = req.headers["x-api-key"];

    if (!rawKey) {
      return res.status(401).json({ error: "API key missing" });
    }

    // hash incoming key
    const hashedKey = crypto
      .createHash("sha256")
      .update(rawKey)
      .digest("hex");

    // find in DB
    const apiKey = await prisma.apiKeys.findFirst({
      where: {
        api_key: hashedKey,
        is_active: true,
        is_deleted: false,
      },
    });

    if (!apiKey) {
      return res.status(403).json({ success: false, message: "Invalid API key" });
    }

    // check expiry
    if (apiKey.expires_at && new Date() > apiKey.expires_at) {
      return res.status(403).json({success: false, message: "API key expired" });
    }

    // update last used
    await prisma.apiKeys.update({
      where: { id: apiKey.id },
      data: { last_used_at: new Date() },
    });

    // attach to request
    req.apiKey = apiKey;
    req.project_id = apiKey.project_id;
    req.environment_id = apiKey.environment_id;
    req.mode = apiKey.mode;


    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
};