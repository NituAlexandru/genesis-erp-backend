import ProductPriceHistory from "../products/productPriceHistoryModel.js";
import mongoose from "mongoose";
import Product from "./productModel.js";

// Calculează media ponderată a prețului de achiziție pentru stocul curent al unui produs
// folosind intrările de tip "entry" (metoda FIFO)
export async function calculateCurrentAveragePurchasePrice(
  productId,
  currentStock
) {
  // Obținem toate intrările de tip "entry" pentru produsul dat, ordonate crescător (FIFO)
  const entries = await ProductPriceHistory.find({
    product: mongoose.Types.ObjectId(productId),
    priceType: "entry",
  }).sort({ date: 1 });

  let remaining = currentStock;
  let totalCost = 0;
  let totalQuantity = 0;

  for (const entry of entries) {
    // Dacă cantitatea din această intrare este mai mică sau egală cu cea rămasă
    // adăugăm întreaga cantitate și costul corespunzător
    if (entry.quantity <= remaining) {
      totalCost += entry.quantity * entry.price;
      totalQuantity += entry.quantity;
      remaining -= entry.quantity;
    } else {
      // Dacă intrarea are mai mult decât avem nevoie pentru a acoperi stocul curent
      totalCost += remaining * entry.price;
      totalQuantity += remaining;
      remaining = 0;
    }
    if (remaining <= 0) break;
  }

  if (totalQuantity === 0) return 0;
  return totalCost / totalQuantity;
}

// Recalculează media ponderată a prețului de achiziție pentru un produs și actualizează câmpul averagePurchasePrice
export async function updateAveragePurchasePrice(productId) {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }

  const newAverage = await calculateCurrentAveragePurchasePrice(
    productId,
    product.currentStock
  );
  product.averagePurchasePrice = newAverage;
  await product.save();
  return newAverage;
}
