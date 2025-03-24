import mongoose from "mongoose";

// Definirea schemei pentru documentul "Return" (retur) în MongoDB
const returnSchema = new mongoose.Schema(
  {
    // Tipul returului: "client" pentru retururi de la clienți (produsele se întorc la noi),
    // "supplier" pentru retururi de la furnizori (refuzate de noi)
    returnType: {
      type: String,
      required: true,
      enum: ["client", "supplier"],
      default: "client",
    },
    // Câmpul "client" se va popula doar dacă returul este de la client;
    // funcția "required" verifică tipul returului și face acest câmp obligatoriu în acest caz.
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: function () {
        return this.returnType === "client";
      },
    },
    // Câmpul "supplier" se va popula doar dacă returul este de la furnizor;
    // funcția "required" verifică tipul returului și face acest câmp obligatoriu în acest caz.
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: function () {
        return this.returnType === "supplier";
      },
    },
    // Lista produselor returnate
    products: [
      {
        // Referință către produsul returnat
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        // Cantitatea returnată a produsului (obligatoriu)
        quantity: { type: Number, required: true },
        // Motivul returului (opțional)
        reason: { type: String, required: false },
        // Prețul produsului la momentul returului, extras de la factura originală, folosit pentru storno
        priceAtReturn: { type: Number, default: null },
      },
    ],
    // Data la care a avut loc returul; implicit se setează data curentă, dar poate fi modificată
    returnDate: {
      type: Date,
      default: Date.now,
    },
    // Statusul returului: "Draft" pentru documente nefinalizate și "Final" pentru cele finalizate
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Final"],
    },
    // Referință la comanda originală din care s-a efectuat storno (opțional)
    originalOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    // Referință la factura originală din care s-a efectuat storno (opțional)
    originalInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: false,
    },
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt" pentru fiecare document
);

// Crearea indexurilor pentru a îmbunătăți performanța interogărilor
returnSchema.index({ client: 1 }); // Index pe câmpul "client" pentru retururi de la clienți
returnSchema.index({ supplier: 1 }); // Index pe câmpul "supplier" pentru retururi de la furnizori
returnSchema.index({ returnDate: 1 }); // Index pe câmpul "returnDate" pentru interogări pe intervale de timp
returnSchema.index({ returnType: 1 }); // Index pe câmpul "returnType" pentru filtrări rapide după tipul returului

// Crearea modelului "Return" folosind schema definită
const Return = mongoose.model("Return", returnSchema);

// Exportarea modelului pentru a putea fi utilizat în alte module ale aplicației
export default Return;
