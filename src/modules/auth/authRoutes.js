import express from "express";
import { login, createUser, getMe, logout } from "./authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/create-user", createUser);

// Get user info
router.get("/me", getMe);

export default router;
