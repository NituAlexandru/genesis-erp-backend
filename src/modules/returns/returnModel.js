import mongoose from "mongoose";

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
    // Dacă este retur de la client, se va popula acest câmp; altfel, este opțional
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: function () {
        return this.returnType === "client";
      },
    },
    // Dacă este retur de la furnizor, se va popula acest câmp; altfel, este opțional
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: function () {
        return this.returnType === "supplier";
      },
    },
    // Produsele returnate
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        reason: { type: String, required: false },
        // Prețul de la momentul returului (de la factura originală, pentru storno)
        priceAtReturn: { type: Number, default: null },
      },
    ],
    // Data returului; implicit data curentă, dar poate fi modificată
    returnDate: {
      type: Date,
      default: Date.now,
    },
    // Statusul returului (ex. "Draft" până când este finalizat)
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Final"],
    },
    // Referințe către documentele originale (comanda și factura din care s-a efectuat storno)
    originalOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
    originalInvoice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: false,
    },
  },
  { timestamps: true }
);

// Indexuri pentru performanță în interogări
returnSchema.index({ client: 1 });
returnSchema.index({ supplier: 1 });
returnSchema.index({ returnDate: 1 });
returnSchema.index({ returnType: 1 });

const Return = mongoose.model("Return", returnSchema);

export default Return;
