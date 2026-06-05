import express from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
import { allowRoles } from "../middleware/role.middleware.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route working");
});

/* -------- DASHBOARD -------- */
router.get(
  "/get-users",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.dashboard,
);

/* -------- CREATE USER -------- */
router.post(
  "/create-user",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.createUser,
);

/* -------- GET USERS -------- */
router.get(
  "/get-all-users",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.getAllUsers,
);
router.get(
  "/get-user-id/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.getUserById,
);

/* -------- UPDATE USER -------- */
router.patch(
  "/update-user/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.updateUser,
);

/* -------- DELETE USER -------- */
router.delete(
  "/delete-user/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.deleteUser,
);

/* -------- UPDATE USER STATUS -------- */
router.patch(
  "/change-user-status/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.changeUserStatus,
);

/* -------- CHANGE PASSWORD -------- */
router.patch(
  "/change-password/:id",
  verifyToken,
  userController.changePassword,
);

/* -------- get user full details with projects and environments -------- */
router.get(
  "/get-user-details-with-projects-env/:id",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.getUserDetailsWithProjectsAndEnvironments,
);

/* remove the environment from the user  */
router.patch(
  "/remove-environment-from-user",
  verifyToken,
  allowRoles(["SUPER_ADMIN", "ADMIN"]),
  userController.removeEnvironmentFromUser,
);

router.get(
  "/user-assigned-projects/:user_id",
  // verifyToken,
  // allowRoles(["SUPER_ADMIN", "ADMIN", "USER"]),
  userController.userAssignedProjectsEnvironments,
);

export default router;
