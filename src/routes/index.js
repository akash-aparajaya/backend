import express from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import userRoutes from "./user.routes.js";
import services from "./services.routes.js";
import gitTokenRoutes from "./gitToken.routes.js";
import clientAccessiblePoint from "./access.routes.js";
import ibv from "./ibv.routes.js";
import ach from "./ach.routes.js";
import logger from "../utils/logger.js";
const router = express.Router();

//* -------- LOGGING -------- *
router.use((req, res, next) => {
  logger.info(`📌 ${req.method} ${req.originalUrl}`);
  next();
});

/* -------- HEALTH -------- */
// ✅ Helper: format uptime
function formatUptime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const decimalHours = hours + minutes / 60;

  return `${decimalHours.toFixed(1)}h`;
}

router.get("/health", async (req, res) => {
  let redisStatus = "disconnected";
  let dbStatus = "disconnected";

  try {
    const pong = await redisConnection.ping();
    if (pong === "PONG") redisStatus = "connected";
  } catch {
    redisStatus = "error";
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "connected";
  } catch {
    dbStatus = "error";
  }

  const uptime = Math.floor(process.uptime());

  res.status(200).json({
    success: true,
    uptime, // number (seconds)
    uptimeFormatted: formatUptime(uptime), // ✅ NO seconds
    services: {
      api: "running",
      database: dbStatus,
      redis: redisStatus,
    },
    timestamp: new Date().toISOString(),
  });
});

/* ========== ROUTES ========== */

/* -------- AUTH -------- */
router.use("/auth", authRoutes);

/* -------- USER -------- */
router.use("/users", userRoutes);

/* -------- PROJECT -------- */
router.use("/project", projectRoutes);

/* -------- SERVICES -------- */
router.use("/services", services);

/* -------- GIT TOKEN -------- */
router.use("/token", gitTokenRoutes);

/* -------- CLIENT ACCESSIBLE POINT -------- */
router.use("/client", clientAccessiblePoint);

/* -------- IBV -------- */
router.use("/ibv", ibv);

/* -------- IBV -------- */
router.use("/ach", ach);

export default router;
