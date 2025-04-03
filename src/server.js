import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";
import connectDB from "./config/db.js";

// Import Routes
import authRoutes from "./modules/auth/authRoutes.js";
import roleRoutes from "./modules/roles/roleRoutes.js";
import userRoutes from "./modules/users/userRoutes.js";
import clientRoutes from "./modules/clients/clientRoutes.js";
import productRoutes from "./modules/products/productRoutes.js";
import categoryRoutes from "./modules/categories/categoryRoutes.js";
import supplierRoutes from "./modules/suppliers/supplierRoutes.js";
import markupRoutes from "./modules/markup/markupRoutes.js";
import vatRateRoutes from "./modules/taxConfiguration/vatRateRoutes.js";

// Load environment variables
dotenv.config();
// Connect to Database
connectDB();
const app = express();

// --- Middleware ---
// CORS Configuration
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : ["http://localhost:3000"];
console.log("Allowed CORS origins:", allowedOrigins);
app.use(
  cors({
    origin: function (origin, callback) {
      // Permite request-uri fără origin (ex: Postman) sau din originile permise
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Permite trimiterea cookie-urilor cross-origin
  })
);

// Body Parser Middleware (pentru a procesa JSON și URL-encoded data)
app.use(express.json({ limit: "10kb" })); // Limitează dimensiunea payload-ului JSON
app.use(express.urlencoded({ extended: true, limit: "10kb" })); // Pentru date din formulare

// Cookie Parser Middleware (pentru a accesa req.cookies)
app.use(cookieParser());

// --- Routes ---
app.get("/", (req, res) => res.send("API is running...")); // Root check
app.use("/api/auth", authRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/markups", markupRoutes);
app.use("/api/vat-rate", vatRateRoutes);

// --- Not Found Handler --- (Prinde rutele ne definite)
app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); 
});

// --- General Error Handler --- (Prinde erorile pasate cu next(error))
app.use((err, req, res, next) => {
  console.error("=".repeat(20), "ERROR HANDLER", "=".repeat(20));
  console.error("Error Status:", err.status || 500);
  console.error("Error Message:", err.message);
  console.error("Error Stack:", err.stack); // Afișează stack trace în loguri
  console.error("=".repeat(50));

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    msg: err.message || "Internal Server Error",
    // Trimite stack trace doar în dezvoltare
    // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    code: err.code, 
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(
    `🚀 Server running in ${
      process.env.NODE_ENV || "development"
    } mode on port ${PORT}`
  )
);

// --- Graceful Shutdown --- (Oprește serverul și DB-ul corect)
process.on("SIGTERM", () => {
  console.info("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.info("MongoDb connection closed");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.info("SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.info("HTTP server closed");
    mongoose.connection.close(false, () => {
      console.info("MongoDb connection closed");
      process.exit(0);
    });
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Închide serverul în caz de eroare ne prinsă gravă
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Închide serverul în caz de eroare ne prinsă gravă
  server.close(() => {
    process.exit(1);
  });
});
