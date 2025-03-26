// src/modules/categories/categoryRoutes.js
import express from "express";
import Category from "./categoryModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Găsește toate categoriile și returnează doar numele
    const categories = await Category.find().select("name -_id");
    res.json(categories.map((cat) => cat.name));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
