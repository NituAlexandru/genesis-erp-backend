import mongoose from "mongoose";

const productPriceHistorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true, // index pentru interogări rapide pe produs
    },
    price: {
      type: Number,
      required: true,
    },
    priceType: {
      type: String,
      required: true,
      enum: ["entry", "exit"], // "entry" pentru prețul de intrare, "exit" pentru prețul de vânzare
    },
    date: {
      type: Date,
      default: Date.now,
      index: true, // index pe dată pentru interogări pe intervale de timp
    },
    // referință la comanda de la care s-a extras prețul
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: false,
    },
  },
  { timestamps: true }
);

const ProductPriceHistory = mongoose.model(
  "ProductPriceHistory",
  productPriceHistorySchema
);
export default ProductPriceHistory;
