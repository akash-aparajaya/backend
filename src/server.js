import app from "./app.js";
import prisma from "./config/prisma.js";

// Workers
import "./workers/sms.worker.js";
import "./workers/email.worker.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("🟢 Database connected");

    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("🔴 Failed to start server:", error);
    process.exit(1);
  }
};

// Graceful shutdown
const shutdown = async () => {
  console.log("🛑 Shutting down server...");
  try {
    await prisma.$disconnect();
    console.log("🔌 Database disconnected");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// Global error handling
process.on("uncaughtException", (err) => {
  console.error("💥 Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 Unhandled Rejection:", err);
});

startServer();