import express from "express";
import { login, createSuperAdmin, refreshAccessToken } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/create-super-admin", createSuperAdmin);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken  );

export default router;