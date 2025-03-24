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
    price: {
      type: Number,
      required: false,
    },
    vatRate: {
      type: Number,
      required: false,
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
  },
  { timestamps: true }
);

// Indexuri utile
productSchema.index({ barCode: 1 });
productSchema.index({ mainSupplier: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
