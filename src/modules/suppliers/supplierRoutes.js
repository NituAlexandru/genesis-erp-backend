import express from "express";
import Supplier from "./supplierModel.js";

const router = express.Router();

// Returnează lista distinctă de nume de furnizori (există deja)
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("_id name");
    res.json(suppliers); // returnează obiecte cu _id și name
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

// Endpoint de căutare cu parametru ?query=
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query || query.length < 1) {
    return res.json([]);
  }
  try {
    // Găsește furnizorii după nume (ignore case)
    const suppliers = await Supplier.find({
      name: { $regex: query, $options: "i" },
    }).select("name _id");
    res.json(suppliers);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
