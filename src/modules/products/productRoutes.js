// productRoutes.js
import express from "express";
import multer from "multer";
import {
  createProductController,
  getAllProductsController,
  getProductByIdController,
  updateProductController,
  deleteProductController,
  softDeleteProductController,
} from "./productController.js";

const router = express.Router();

// multer foloseste stocare în memorie (pentru testare)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Rutele de produse
router.get("/", getAllProductsController);
router.post("/", upload.array("images"), createProductController);
router.get("/:id", getProductByIdController);
router.put("/:id", upload.array("images"), updateProductController);
router.delete("/:id", deleteProductController);
router.patch("/:id/soft-delete", softDeleteProductController);

export default router;
