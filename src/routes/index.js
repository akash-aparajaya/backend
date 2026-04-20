import express from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import projectRoutes from "./project.routes.js";
import userRoutes from "./user.routes.js";
import services from "./services.routes.js";
const router = express.Router();

//* -------- LOGGING -------- *
router.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.originalUrl}`);
  next();
});

/* -------- HEALTH -------- */
router.get("/health", (req, res) => {
  res.json({ status: "OK" });
});

/* -------- ROUTES -------- */
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/project", projectRoutes);
router.use("/users", userRoutes);
router.use("/services", services);

export default router;
