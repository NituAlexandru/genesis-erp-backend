import express from "express";
import {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
} from "./roleController.js";
import { authMiddleware } from "../auth/authMiddleware.js";
import { checkAdminOrAdministrator } from "../permisions/permisionsMiddleware.js";

const router = express.Router();

router.post("/", createRole);
router.get("/", getAllRoles);
router.get("/:id", getRoleById);
router.put("/:id", authMiddleware, checkAdminOrAdministrator, updateRole);
router.delete("/:id", deleteRole);

export default router;
