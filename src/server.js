import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./modules/auth/authRoutes.js";
import roleRoutes from "./modules/roles/roleRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import clientRoutes from "./modules/clients/clientRoutes.js";
import productRoutes from "./modules/products/productRoutes.js";
import categoryRoutes from "./modules/categories/categoryRoutes.js";
import supplierRoutes from "./modules/suppliers/supplierRoutes.js";
import markupRoutes from "./modules/markup/markupRoutes.js";
import vatRateRoutes from "./modules/taxConfiguration/vatRateRoutes.js";

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/markups", markupRoutes);
app.use("/api/vat-rate", vatRateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
