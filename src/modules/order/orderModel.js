import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // Clientul căruia îi vindem
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },
    // Cine a creat vânzarea (Agent Vanzari sau alt utilizator)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Produsele vândute – include și entryPrice, prețul de intrare la momentul lansării comenzii
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }, // Prețul de vânzare la momentul comenzii
        unitMeasure: { type: String, required: true }, // ex. "buc", "kg", "palet"
        entryPrice: { type: Number, default: null }, // Prețul de intrare al produsului, opțional
      },
    ],
    // Data comenzii: stochează data exactă cu oră, minut, sec.
    orderDate: {
      type: Date,
      default: Date.now,
    },
    // Numărul comenzii: formatul poate fi "zz/ll/aa" urmat de un număr secvențial (ex. zz/ll/aa01)
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Statusul comenzii
    status: {
      type: String,
      default: "Lansata",
      enum: ["Lansata", "In pregatire", "Incarcata", "Confirmata", "Livrata"],
    },
    // Adresa de livrare (opțional)
    deliveryAddress: {
      type: String,
      required: false,
    },
    // Data livrării (poate fi setată sau modificată de utilizator)
    deliveryDate: {
      type: Date,
      required: false,
    },
    // Comentarii suplimentare pentru comandă
    comments: {
      type: String,
      required: false,
    },
    // Denormalizare: stochează valoarea totală și profitul calculat pentru comandă,
    // astfel încât să nu fie nevoie de calcule complexe la fiecare interogare.
    totalValue: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexuri pentru performanță în interogări
orderSchema.index({ orderNumber: 1 }, { unique: true });
orderSchema.index({ client: 1 });
orderSchema.index({ createdBy: 1 });
orderSchema.index({ orderDate: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ deliveryDate: 1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
