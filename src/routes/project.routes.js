import express from "express";
import { createProject } from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create-project",
  verifyToken,
  allowRoles("ADMIN"),
  createProject
);

export default router;