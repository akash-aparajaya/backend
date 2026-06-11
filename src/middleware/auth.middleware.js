import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      error: "No token provided",
    });
  }

  const parts = authHeader.split(" ");

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Invalid token format",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const user = await prisma.user.findUnique({
      where: {
        public_id: decoded.id,
      },
      select: {
        public_id: true,
        is_deleted: true,
        is_active: true,
      },
    });

    if (
      !user ||
      user.is_deleted ||
      !user.is_active
    ) {
      return res.status(401).json({
        error: "Account no longer available",
      });
    }

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token expired or invalid",
    });
  }
};