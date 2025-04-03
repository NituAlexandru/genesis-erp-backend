import express from "express";
import {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
} from "./userController.js";
import { body, param } from "express-validator";
import {
  authMiddleware,
  checkAdminOrAdministrator,
  checkPermission,
} from "../auth/authMiddleware.js";

const router = express.Router();
// --- Middleware aplicat tuturor rutelor din acest fișier ---
router.use(authMiddleware); // Toate rutele necesită autentificare
// --- Definirea regulilor de validare reutilizabile ---
const idValidation = [
  param("id").isMongoId().withMessage("ID utilizator invalid format."),
];
const usernameParamValidation = [
  param("username")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("Username parameter is required."),
];

const createUserValidation = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username este obligatoriu.")
    .isLength({ min: 3 })
    .withMessage("Username trebuie să aibă minim 3 caractere."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email este obligatoriu.")
    .isEmail()
    .withMessage("Trebuie să fie o adresă de email validă.")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Parola este obligatorie.")
    .isLength({ min: 6 })
    .withMessage("Parola trebuie să aibă minim 6 caractere."),
  body("roleName") // Validăm 'roleName' 
    .trim()
    .notEmpty()
    .withMessage("Numele rolului este obligatoriu."),
  body("name")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Numele trebuie să fie text."),
];

const updateUserValidation = [
  // Nu permitem actualizarea username-ului
  body("username").not().exists().withMessage("Username cannot be updated."),
  // Câmpurile opționale pentru actualizare
  body("email")
    .optional()
    .trim()
    .isEmail()
    .withMessage("Trebuie să fie o adresă de email validă.")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Parola trebuie să aibă minim 6 caractere."),
  body("roleName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Numele rolului nu poate fi gol dacă este furnizat."),
  body("name")
    .optional({ checkFalsy: true })
    .trim()
    .isString()
    .withMessage("Numele trebuie să fie text."),
];

// --- Definirea Rutelor ---

// POST /api/users - Creare utilizator
// Necesită rol de Admin/Administrator
router.post(
  "/",
  checkAdminOrAdministrator, // Verifică rolul Admin sau Administrator
  createUserValidation, // Aplică regulile de validare pentru creare
  createUser // Controller-ul pentru creare user
);

// GET /api/users/username/:username - Obținere user după username
// Permis tuturor utilizatorilor autentificați (fără checkPermission specific aici)
router.get(
  "/username/:username",
  usernameParamValidation, // Validează parametrul username
  getUserByUsername
);

// GET /api/users/:id - Obținere user după ID
// Permis tuturor utilizatorilor autentificați
router.get(
  "/:id",
  idValidation, // Validează parametrul ID
  getUserById
);

// PUT /api/users/:id - Actualizare utilizator
// Necesită rol de Admin/Administrator
router.put(
  "/:id",
  checkAdminOrAdministrator, // Verifică rolul
  idValidation, // Validează ID-ul din URL
  updateUserValidation, // Aplică regulile de validare pentru update
  updateUser // Controller-ul pentru update
);

// DELETE /api/users/:id - Ștergere utilizator
// Necesită rol de Admin/Administrator
router.delete(
  "/:id",
  checkAdminOrAdministrator, // Verifică rolul
  idValidation, // Validează ID-ul din URL
  deleteUser // Controller-ul pentru ștergere
);

export default router;
