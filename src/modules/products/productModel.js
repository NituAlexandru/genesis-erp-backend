import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    barCode: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    mainSupplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: false,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },
    salesPrice: {
      price1: { type: Number, default: 0 },
      price2: { type: Number, default: 0 },
      price3: { type: Number, default: 0 },
    },
    // stoc minim + stoc actual (pentru notifica daca e sub un prag)
    minStock: { type: Number, default: 0 },
    currentStock: { type: Number, default: 0 },
    // date de primă / ultimă comandă
    firstOrderDate: { type: Date, required: false },
    lastOrderDate: { type: Date, required: false },
    // câmpuri suplimentare: imagini, categorii, specificații tehnice
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 },
    weight: { type: Number, default: 0 },
    volume: { type: Number, default: 0 },
    // packaging: {
    //   // Dropdown 1: Primary Sales Method – modul de vânzare inițial
    //   primarySalesMethod: {
    //     type: String,
    //     enum: ["piece", "kg", "liter", "sack", "box", "tube", "pallet"],
    //     required: true,
    //   },
    //   // Dropdown 2: Secondary Sales Method – pentru conversii suplimentare
    //   secondarySalesMethod: {
    //     type: String,
    //     enum: ["pallet", "cubicMeter", "box", "pack"],
    //     default: null,
    //   },
    //   // Dropdown 3: Truck Sales Method – modul de transport/vehicul
    //   truckSalesMethod: {
    //     type: String,
    //     enum: ["pallet", "truck", "smallMachine"],
    //     default: null,
    //   },
    //   // Câmpuri pentru factorii de conversie:
    //   // De exemplu, dacă produsul se vinde la "piece", câte bucăți intră într-un palet (sau într-un metru cub)
    //   primaryToSecondary: { type: Number, default: 0 },
    //   // De exemplu, câte bucăți pot intra pe un camion
    //   primaryToTruck: { type: Number, default: 0 },
    //   // De exemplu, câte unități secundare (paleti sau m³) intră pe camion
    //   secondaryToTruck: { type: Number, default: 0 },
    // },
    packaging: {
      itemsPerBox: { type: Number, default: 0 },
      boxesPerPallet: { type: Number, default: 0 },
      itemsPerPallet: { type: Number, default: 0 },
      maxPalletsPerTruck: { type: Number, default: 0 },
    },
    // calcul pret mediu achizitie
    averagePurchasePrice: { type: Number, default: 0 },
    // Markup-urile implicite (ca procente, ex. 0.20 pentru 20%)
    defaultMarkups: {
      markup1: { type: Number, default: 0 },
      markup2: { type: Number, default: 0 },
      markup3: { type: Number, default: 0 },
    },
    // Markup personalizat per client
    clientMarkups: [
      {
        clientId: { type: mongoose.Schema.Types.ObjectId, ref: "Client" },
        // Pentru fiecare client poți avea 3 valori
        markups: {
          markup1: { type: Number, required: true },
          markup2: { type: Number, required: true },
          markup3: { type: Number, required: true },
        },
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Indexuri utile
productSchema.index({ barCode: 1 });
productSchema.index({ mainSupplier: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
