import express from "express";
import { createAdmin } from "../controllers/admin.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create-admin",
  verifyToken,
  allowRoles("SUPER_ADMIN"),
  createAdmin
);

export default router;