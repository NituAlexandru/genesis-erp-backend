import express from "express";
import { updateProductMarkups } from "./markupController.js";

const router = express.Router();

router.put("/", updateProductMarkups);

export default router;
