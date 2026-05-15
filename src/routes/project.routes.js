import express from "express";
import {
  createProject,
  getProjects,
  getProjectId,
  updateProjectStatus,
  createEnvironment,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/* -------- CREATE PROJECT -------- */
router.post(
  "/create-project",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  upload.single("image_url"),
  createProject,
);

/* -------- GET ALL PROJECTS -------- */
router.get(
  "/get-projects",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProjects,
);

/* -------- GET SINGLE PROJECT -------- */
router.get(
  "/get-project/:id",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProjectId
);

/* -------- UPDATE PROJECT STATUS -------- */
router.patch(
  "/update-project-status/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
);

/* -------- UPDATE PROJECT -------- */
router.patch(
  "/update-project/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  upload.single("image_url"),
);

/* -------- SOFT DELETE PROJECT -------- */
router.delete(
  "/delete-project/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
);

router.post("/create-environment/:projectId",  createEnvironment);

export default router;
