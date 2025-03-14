import express from "express";
import { login, createUser, getMe } from "./authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-user", createUser);

// Get user info 
router.get("/me", getMe);

export default router;
