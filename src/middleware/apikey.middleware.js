import crypto from "crypto";
import prisma from "../config/prisma.js";

export const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    // 1. Check if key exists
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: "API key missing in headers (x-api-key)",
      });
    }

    // 2. Hash incoming key (NEVER store raw key)
    const hashedKey = crypto
      .createHash("sha256")
      .update(apiKey)
      .digest("hex");

    // 3. Find key in DB
    const keyRecord = await prisma.apiKey.findUnique({
      where: { keyHash: hashedKey },
      include: {
        project: true,
      },
    });

    // 4. Validate key
    if (!keyRecord) {
      return res.status(403).json({
        success: false,
        message: "Invalid API key",
      });
    }

    // 5. Check if project is active
    if (!keyRecord.project.isActive) {
      return res.status(403).json({
        success: false,
        message: "Project is disabled",
      });
    }

    // 6. Attach project to request
    req.project = keyRecord.project;
    req.apiKeyId = keyRecord.id;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "API Key validation error",
      error: error.message,
    });
  }
};