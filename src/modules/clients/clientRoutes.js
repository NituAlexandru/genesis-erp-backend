import { Router } from "express";
import {
  createClientController,
  getAllClientsController,
  getClientByIdController,
  updateClientController,
  deleteClientController,
} from "./clientController.js";
import { checkPermission } from "../permisions/permisionsMiddleware.js";

const router = Router();

// GET ALL clients
router.get("/", checkPermission("VIEW_CLIENTS"), getAllClientsController);

// GET client by ID
router.get("/:id", checkPermission("VIEW_CLIENTS"), getClientByIdController);

// CREATE client
router.post("/", checkPermission("CREATE_CLIENTS"), createClientController);

// UPDATE client
router.put("/:id", checkPermission("UPDATE_CLIENTS"), updateClientController);

// DELETE client
router.delete(
  "/:id",
  checkPermission("DELETE_CLIENTS"),
  deleteClientController
);

export default router;
