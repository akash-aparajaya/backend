import express from "express";
import {
  createProject,
  getProjects,
  getProjectId,
  updateProjectStatus,
  createEnvironment,
  getEnvironmentsByProjectId,
  updateEnvironmentById,
  deleteEnvironmentById,
  assignUnassignEmployeeToEnvironment,
  getAssignedAndUnassignedEmployees,
} from "../controllers/project.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

/`* -------- Project Routes -------- *`/;

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
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProjects,
);

/* -------- GET SINGLE PROJECT -------- */
router.get(
  "/get-project/:id",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProjectId,
);

/* -------- UPDATE PROJECT STATUS -------- */
router.patch(
  "/update-project-status/:id",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  updateProjectStatus,
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

/`*-------- ENVIRONMENT ROUTES -------- *`/;

/* -------- GET ENVIRONMENTS BY PROJECT ID -------- */
router.get(
  "/get-environments/:projectId",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getEnvironmentsByProjectId,
);

/* -------- CREATE ENVIRONMENT -------- */
router.post("/create-environment/:projectId", createEnvironment);

/* -------- GET ENVIRONMENTS -------- */
router.get("/get-environments/:projectId", getEnvironmentsByProjectId);

/* -------- update ENVIRONMENT BY ID -------- */
router.patch(
  "/update-environment/:id",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN"]),
  updateEnvironmentById,
);

/* -------- delete ENVIRONMENT BY ID -------- */
router.delete(
  "/delete-environment/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  deleteEnvironmentById,
);

/`*-------- ASSIGN - UNASSIGN EMPLOYEE ROUTES -------- *`/;

/*-------- Assign / unassigned employee to project specific environment -------- */
router.post(
  "/assign-unassign-employee/:environmentId",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  assignUnassignEmployeeToEnvironment,
);

/* -------- GET ASSIGNED AND UNASSIGNED EMPLOYEES -------- */
router.get(
  "/get-assigned-unassigned-employees/:projectId/:environmentId",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getAssignedAndUnassignedEmployees,
);

export default router;
