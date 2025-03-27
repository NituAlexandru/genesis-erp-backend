import express from "express";
import { updateVatRate, getVatRate } from "./vatRateController.js";

const router = express.Router();

// GET /api/vat-rate - obține valoarea curentă a TVA
router.get("/", getVatRate);

// PUT /api/vat-rate - actualizează valoarea TVA
router.put("/", updateVatRate);

export default router;
