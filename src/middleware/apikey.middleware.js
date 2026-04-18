import prisma from "../config/prisma.js";

export const validateApiKey = async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey) {
      return res.status(401).json({ error: "API Key missing" });
    }

    const project = await prisma.project.findUnique({
      where: { apiKey },
      include: { services: true },
    });

    if (!project) {
      return res.status(403).json({ error: "Invalid API Key" });
    }

    req.project = project; // attach project

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};