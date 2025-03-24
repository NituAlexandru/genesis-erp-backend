import mongoose from "mongoose";

// Definirea schemei pentru istoricul prețurilor unui produs
const productPriceHistorySchema = new mongoose.Schema(
  {
    // Referință către produsul pentru care se înregistrează istoricul prețurilor
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Leagă acest câmp de modelul "Product"
      required: true, // Câmp obligatoriu
      index: true, // Index pentru interogări rapide pe baza produsului
    },
    // Prețul produsului la momentul înregistrării
    price: {
      type: Number,
      required: true,
    },
    // Tipul prețului: "entry" pentru prețul de intrare, "exit" pentru prețul de vânzare
    priceType: {
      type: String,
      required: true,
      enum: ["entry", "exit"],
    },
    // Data la care a fost înregistrat prețul
    date: {
      type: Date,
      default: Date.now, // Setează data curentă ca valoare implicită
      index: true, // Index pe dată pentru interogări eficiente pe intervale de timp
    },
    // Referință la comanda de la care s-a extras prețul (opțional)
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // Leagă acest câmp de modelul "Order"
      required: false,
    },
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt"
);

// Crearea modelului "ProductPriceHistory" folosind schema definită
const ProductPriceHistory = mongoose.model(
  "ProductPriceHistory",
  productPriceHistorySchema
);

// Exportarea modelului pentru a putea fi utilizat în alte module ale aplicației
export default ProductPriceHistory;
