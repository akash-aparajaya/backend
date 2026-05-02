import express from "express";
import authRoutes from "./auth.routes.js";
import projectRoutes from "./project.routes.js";
import userRoutes from "./user.routes.js";
import services from "./services.routes.js";
import logger from "../utils/logger.js";
const router = express.Router();

//* -------- LOGGING -------- *
router.use((req, res, next) => {
  logger.info(`📌 ${req.method} ${req.originalUrl}`);
  next();
});

/* -------- HEALTH -------- */
router.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
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

export default router;
