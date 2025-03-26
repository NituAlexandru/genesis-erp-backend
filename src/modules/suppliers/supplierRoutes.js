import express from "express";
import Supplier from "./supplierModel.js";

const router = express.Router();

// Returnează lista distinctă de nume de furnizori
router.get("/", async (req, res) => {
  try {
    const suppliers = await Supplier.find().select("name -_id");
    res.json(suppliers.map((sup) => sup.name));
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
});

export default router;
