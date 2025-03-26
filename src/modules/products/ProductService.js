import Product from "./productModel.js";
import ProductPriceHistory from "./productPriceHistoryModel.js";
import Supplier from "../suppliers/supplierModel.js";
// Creează un produs nou
export async function createProduct(productData) {
  // Dacă se specifică o categorie, verifică dacă există în colecția de categorii
  if (productData.category) {
    let category = await Category.findOne({ name: productData.category });
    if (!category) {
      category = await Category.create({ name: productData.category });
    }
    // Poți salva doar numele categoriei sau o referință, în funcție de designul tău
    productData.category = category.name;
  }

  const product = new Product(productData);
  const savedProduct = await product.save();

  // Dacă are preț, salvăm în istoricul de preț
  if (savedProduct.price) {
    await createPriceHistory(savedProduct._id, savedProduct.price, "exit");
  }

  return savedProduct;
}

// Obține toate produsele, cu filtrare opțională
export async function getAllProducts(query) {
  const filter = {};

  // Filtru inStock = "true" => currentStock > 0
  if (query.inStock === "true") {
    filter.currentStock = { $gt: 0 };
  }

  // Alte filtre (ex. preț min/max, etc.) pot fi adăugate aici

  const products = await Product.find(filter)
    .populate("mainSupplier", "name")
    .sort({ createdAt: -1 });
  return products;
}

// Obține un produs după ID
export async function getProductById(productId) {
  const product = await Product.findById(productId);
  return product;
}

// Actualizează un produs
export async function updateProduct(productId, updateData) {
  const oldProduct = await Product.findById(productId);
  if (!oldProduct) {
    throw new Error("Product not found");
  }

  const oldPrice = oldProduct.price;
  const newPrice = updateData.price;

  const updatedProduct = await Product.findByIdAndUpdate(
    productId,
    { $set: updateData },
    { new: true }
  );

  // Dacă prețul s-a modificat, salvăm noul preț în istoricul de preț
  if (newPrice && newPrice !== oldPrice) {
    await createPriceHistory(updatedProduct._id, newPrice, "exit");
  }

  return updatedProduct;
}

// Șterge un produs
export async function deleteProduct(productId) {
  const deleted = await Product.findByIdAndDelete(productId);
  return deleted;
}

// Creează o intrare în istoricul de preț
async function createPriceHistory(productId, price, priceType) {
  await ProductPriceHistory.create({
    product: productId,
    price,
    priceType,
  });
}
