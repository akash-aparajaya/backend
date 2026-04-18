import express from "express";
import * as userController from "../controllers/user.controller.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("User route working");
});
router.post("/create-user", userController.createUser);
router.get("/get-users", userController.getUsers);


export default router; 