import express from "express";
import * as userController from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route working");
});
router.post("/create-user", userController.createUser);
router.get("/getAllUsers",verifyToken, userController.getAllUsers);
router.patch("/changeUserStatus/:id", verifyToken, userController.changeUserStatus);
router.get("/get-user/:id",verifyToken, userController.getUserData);

router.get("/get-users",verifyToken, userController.getUserData);
router.get("/getUsers",verifyToken, userController.getUsers);
router.patch("/:id/password", verifyToken, userController.changePassword);


export default router; 