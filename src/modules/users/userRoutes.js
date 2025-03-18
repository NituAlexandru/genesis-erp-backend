import express from "express";
import {
  createUser,
  getUserById,
  getUserByUsername,
  updateUser,
  deleteUser,
} from "./userController.js";

const router = express.Router();

// POST pentru crearea utilizatorului
router.post("/", createUser);

// GET pentru obținerea unui utilizator după username
router.get("/username/:username", getUserByUsername);

// GET pentru obținerea unui utilizator după ID
router.get("/:id", getUserById);

// PUT pentru actualizarea unui utilizator
router.put("/:id", updateUser);

// DELETE pentru ștergerea unui utilizator
router.delete("/:id", deleteUser);

export default router;
