import express from "express";
import authRoutes from "./auth.routes.js";
import adminRoutes from "./admin.routes.js";
import projectRoutes from "./project.routes.js";
import userRoutes from "./user.routes.js";
import smsRoutes from "./sms.routes.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/project", projectRoutes);


router.use("/users", userRoutes);


router.use("/sms", smsRoutes);


export default router;