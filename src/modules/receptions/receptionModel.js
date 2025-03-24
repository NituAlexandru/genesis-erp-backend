import mongoose from "mongoose";

const receptionSchema = new mongoose.Schema(
  {
    // Cine a realizat recepția (utilizatorul care a făcut recepția)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Referință la furnizorul care a livrat
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true,
    },
    // Listă de produse recepționate
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        unitMeasure: { type: String, required: true }, // ex. "buc", "kg", "palet"
        // Prețul de intrare la momentul recepției pentru produs
        priceAtReception: { type: Number, default: null },
      },
    ],
    // Data recepției (implicit data curentă, dar poate fi modificată)
    receptionDate: {
      type: Date,
      default: Date.now,
    },
    // Alte câmpuri: sofer, nr autoturismului etc.
    driverName: {
      type: String,
      required: false,
    },
    carNumber: {
      type: String,
      required: false,
    },
    // Statusul recepției: "Draft" sau "Final"
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Final"],
    },
  },
  { timestamps: true }
);

// Indexuri pentru performanță
receptionSchema.index({ createdBy: 1 });
receptionSchema.index({ supplier: 1 });
receptionSchema.index({ receptionDate: 1 });
receptionSchema.index({ status: 1 });

const Reception = mongoose.model("Reception", receptionSchema);
export default Reception;
