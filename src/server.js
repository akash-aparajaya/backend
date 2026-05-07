import app from "./app.js";
import prisma from "./config/prisma.js";
import logger from "./utils/logger.js";
import { redisConnection } from "./config/redis.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // ✅ Database
    await prisma.$connect();
    logger.verbose("💾 Database connected");

    // ✅ Redis
    await redisConnection.ping();
    logger.verbose("⚡ Redis connected");

    // ✅ Start server
    app.listen(PORT, () => {
      logger.verbose(`🚀 Server running on http://localhost:${PORT}`);
      logger.verbose(`⏱ Server started at ${new Date().toISOString()}`);
    });

  } catch (error) {
    logger.error("🔴 Failed to start server:", error);
    process.exit(1);
  }
};

// ✅ Graceful shutdown
const shutdown = async () => {
  logger.warn("🛑 Shutting down server...");
  try {
    await prisma.$disconnect();
    await redisConnection.quit();
    logger.warn("🔌 Clean shutdown complete");
    process.exit(0);
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  logger.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  logger.error("💥 Unhandled Rejection:", err);
});

startServer();