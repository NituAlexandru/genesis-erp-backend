import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnp: {
      type: String,
      required: false,
    },
    cui: {
      type: String,
      required: false,
    },
    nrRegComert: {
      type: String,
      required: false,
    },
    clientType: {
      type: String, // "fizica" sau "juridica"
      required: true,
      enum: ["persoana fizica", "persoana juridica"],
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    iban: {
      type: String,
      required: false,
    },
    // Referințe spre alte documente
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
    avizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aviz",
      },
    ],
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
    // câmpuri denormalizate pentru scalabilitate
    totalOrders: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
    totalDeliveries: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalCosts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// INDEXARE: se pot crea indexuri pe câmpurile cele mai folosite la căutare
clientSchema.index({ cnp: 1 }, { sparse: true });
clientSchema.index({ cui: 1 }, { sparse: true });
clientSchema.index({ phone: 1 }, { sparse: true });
clientSchema.index({ email: 1 }, { sparse: true });

const Client = mongoose.model("Client", clientSchema);

export default Client;
