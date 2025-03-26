import express from "express";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
} from "./productController.js";

const router = express.Router();

// GET /api/products - obține toate produsele (cu filtre prin query)
router.get("/", getAllProductsController);

// POST /api/products - creează un produs nou
router.post("/", createProductController);

// GET /api/products/:id - obține produs după ID
router.get("/:id", getProductByIdController);

// PUT /api/products/:id - actualizează produs
router.put("/:id", updateProductController);

// DELETE /api/products/:id - șterge produs
router.delete("/:id", deleteProductController);

export default router;
