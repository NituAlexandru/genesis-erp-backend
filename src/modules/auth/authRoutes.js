import express from "express";
import {
  login,
  // createUser, // Eliminat
  getMe,
  logout,
  refreshToken,
} from "./authController.js";
import { body } from "express-validator";
import { authMiddleware } from "./authMiddleware.js"; // Importăm middleware-ul

const router = express.Router();

// --- Login Route ---
router.post(
  "/login",
  [
    // Regulile de validare pentru login
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username este obligatoriu."),
    body("password").notEmpty().withMessage("Parola este obligatorie."),
  ],
  login // Controller-ul de login
);

// --- Logout Route ---
// Nu necesită date în body sau autentificare strictă (șterge cookie-urile oricum)
router.post("/logout", logout);

// --- Get Current User Route ---
// Necesită un access token valid în cookie (verificat de authMiddleware)
router.get(
  "/me",
  authMiddleware, // Aplică middleware-ul de autentificare
  getMe // Controller-ul care returnează datele userului
);

// --- Refresh Token Route ---
// Nu necesită authMiddleware (deoarece verifică refreshToken-ul, nu accessToken-ul)
router.post("/refresh", refreshToken);

export default router;
