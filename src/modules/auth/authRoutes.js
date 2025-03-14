import express from "express";
import { login, createUser } from "./authController.js";

const router = express.Router();

router.post("/login", login);
router.post("/create-user", createUser);

export default router;
