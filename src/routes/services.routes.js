import express from "express";
import {
  getProvidersByServiceIdController,
  getAllServicesController,
  getProviderByIdController,
  createProviderController,
  updateProviderController,
  deleteProviderController,
  getProvidersByEnvironmentIdController,
  unlockServiceController,
  revealProviderCredentials,
} from "../controllers/services.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";

const router = express.Router();

/* -------- All Services -------- */
router.get(
  "/get-all-services",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getAllServicesController,
);

/* -------- get providers by environment id -------- */
router.get(
  "/get-all-providers-by-environment/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProvidersByEnvironmentIdController,
);

/* -------- get providers by service id -------- */
router.get(
  "/get-providers-by-service-id/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProvidersByServiceIdController,
);

/* -------- get provider by id -------- */
router.get(
  "/get-provider-by-id/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  getProviderByIdController,
);

/* -------- create provider based on project-services -------- */
router.post(
  "/create-provider",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  createProviderController,
);

/* -------- update provider -------- */
router.patch(
  "/update-provider/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  updateProviderController,
);

/* -------- delete provider -------- */
router.patch(
  "/delete-provider/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  deleteProviderController,
);

/* -------- reveal provider credentials -------- */
router.get(
  "/reveal-provider-credentials/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN", "USER"]),
  revealProviderCredentials,
);

/* -------- unlock service -------- */
router.post(
  "/unlock-service",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  unlockServiceController,
);

export default router;
