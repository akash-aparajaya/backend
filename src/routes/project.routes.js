import express from "express";
import { createProject, getProjects} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

router.post(
  "/create-project",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  createProject
);

router.get(
  "/get-projects",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProjects
);

export default router;