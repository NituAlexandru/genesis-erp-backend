import mongoose from "mongoose";
import Product from "./productModel.js";
import ProductPriceHistory from "./productPriceHistoryModel.js";
import Category from "../categories/categoryModel.js"; // Importăm modelul Category
import Supplier from "../suppliers/supplierModel.js";

// Creează un produs nou
export async function createProduct(productData) {
  // console.log("DEBUG createProduct -> initial productData:", productData);

  // Process mainSupplier field
  if (productData.mainSupplier) {
    if (!mongoose.Types.ObjectId.isValid(productData.mainSupplier)) {
      const foundSupplier = await Supplier.findOne({
        name: productData.mainSupplier,
      });
      if (foundSupplier) {
        productData.mainSupplier = foundSupplier._id;
      } else {
        productData.mainSupplier = null;
      }
    } else {
      productData.mainSupplier = new mongoose.Types.ObjectId(
        productData.mainSupplier
      );
      "DEBUG createProduct -> mainSupplier converted:",
        productData.mainSupplier.toString();
    }
  }

  // Process category field
  if (productData.category) {
    // console.log(
    //   "DEBUG createProduct -> category before conversion:",
    //   productData.category
    // );
    if (!mongoose.Types.ObjectId.isValid(productData.category)) {
      let foundCategory = await Category.findOne({
        name: productData.category,
      });
      if (!foundCategory) {
        foundCategory = await Category.create({ name: productData.category });
      }
      productData.category = foundCategory._id;
    } else {
      productData.category = new mongoose.Types.ObjectId(productData.category);
      // console.log(
      //   "DEBUG createProduct -> category converted:",
      //   productData.category.toString()
      // );
    }
  }

  // Ensure averagePurchasePrice is set (for purchase price per unit)
  if (!productData.averagePurchasePrice) {
    productData.averagePurchasePrice = 0;
  }

  // console.log("DEBUG createProduct -> final productData:", productData);

  // Create the product
  const product = new Product(productData);
  const savedProduct = await product.save();

  // Create price history for sale price if available (type "exit")
  if (savedProduct.salesPrice && savedProduct.salesPrice.price1) {
    // For sale price, we use quantity 1 (or adjust as needed)
    await createPriceHistory(
      savedProduct._id,
      savedProduct.salesPrice.price1,
      "exit",
      1
    );
  }

  // Create price history for purchase price (type "entry")
  // Use currentStock as quantity for the purchase price
  if (
    savedProduct.averagePurchasePrice &&
    savedProduct.averagePurchasePrice > 0
  ) {
    const qty = savedProduct.currentStock > 0 ? savedProduct.currentStock : 1;
    await createPriceHistory(
      savedProduct._id,
      savedProduct.averagePurchasePrice,
      "entry",
      qty
    );
  }

  return savedProduct;
}

// Obține toate produsele, cu filtrare
export async function getAllProducts(query) {
  const filter = {};

  if (query.inStock === "true") {
    filter.currentStock = { $gt: 0 };
  }
  if (query.query) {
    filter.name = { $regex: query.query, $options: "i" };
  }

  const products = await Product.find(filter)
    .populate("mainSupplier", "name _id")
    .populate("category", "name _id")
    .sort({ createdAt: -1 });

  return products;
}

export async function getProductById(productId) {
  const product = await Product.findById(productId);
  return product;
}

export async function updateProduct(productId, updateData) {
  const oldProduct = await Product.findById(productId);
  if (!oldProduct) {
    throw new Error("Product not found");
  }

  const oldPrice = oldProduct.salesPrice ? oldProduct.salesPrice.price1 : 0;
  const newPrice =
    updateData.salesPrice && updateData.salesPrice.price1
      ? updateData.salesPrice.price1
      : oldPrice;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true }
  );

  if (newPrice && newPrice !== oldPrice) {
    await createPriceHistory(updatedProduct._id, newPrice, "exit", 1);
  }

  return updatedProduct;
}

// Șterge un produs
export async function deleteProduct(productId) {
  const deleted = await Product.findByIdAndDelete(productId);
  return deleted;
}

// Creează o intrare în istoricul de preț
async function createPriceHistory(productId, price, priceType, quantity) {
  // console.log(
  //   "DEBUG createPriceHistory -> productId:",
  //   productId,
  //   "price:",
  //   price,
  //   "priceType:",
  //   priceType,
  //   "quantity:",
  //   quantity
  // );
  await ProductPriceHistory.create({
    product: productId,
    price,
    priceType,
    quantity,
  });
}
