// categoryRoutes.js
import express from "express";
import Category from "./categoryModel.js";

const router = express.Router();

// GET /api/categories - returnează categoriile (nume, id)
router.get("/", async (req, res) => {
  try {
    // ex: returnăm toate categoriile
    const categories = await Category.find().select("name");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// GET /api/categories/search?query=...
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 1) {
    return res.json([]);
  }
  try {
    const categories = await Category.find({
      name: { $regex: query, $options: "i" },
    }).select("name _id");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
