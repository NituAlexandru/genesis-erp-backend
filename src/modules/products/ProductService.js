import Product from "./productModel.js";
import ProductPriceHistory from "./productPriceHistoryModel.js";
import Category from "../categories/categoryModel.js"; // Importăm modelul Category

// Creează un produs nou
export async function createProduct(productData) {
  if (productData.mainSupplier) {
    if (mongoose.Types.ObjectId.isValid(productData.mainSupplier)) {
      // e deja un ID valid
    } else {
      // e un string => caut în DB după name
      const foundSupplier = await Supplier.findOne({
        name: productData.mainSupplier,
      });
      if (foundSupplier) {
        productData.mainSupplier = foundSupplier._id;
      } else {
        productData.mainSupplier = null; // sau creezi un supplier nou, după preferințe
      }
    }
  }

  if (productData.category) {
    if (mongoose.Types.ObjectId.isValid(productData.category)) {
      // e deja un ID valid
    } else {
      // e un string => căutăm categorie după name
      let foundCategory = await Category.findOne({
        name: productData.category,
      });
      if (!foundCategory) {
        foundCategory = await Category.create({ name: productData.category });
      }
      productData.category = foundCategory._id;
    }
  }

  // Creăm produsul
  const product = new Product(productData);
  const savedProduct = await product.save();

  // Istoric de preț, etc.
  if (savedProduct.salesPrice && savedProduct.salesPrice.price1) {
    await createPriceHistory(
      savedProduct._id,
      savedProduct.salesPrice.price1,
      "exit"
    );
  }

  return savedProduct;
}

// Obține toate produsele, cu filtrare
export async function getAllProducts(query) {
  const filter = {};

  // Adaugă eventuale filtre din query, de exemplu:
  if (query.inStock === "true") {
    filter.currentStock = { $gt: 0 };
  }
  if (query.query) {
    filter.name = { $regex: query.query, $options: "i" };
  }

  const products = await Product.find(filter)
    .populate("mainSupplier", "name _id") // Populate pentru mainSupplier
    .populate("category", "name _id") // Populate pentru category
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

  // Folosim salesPrice.price1 ca preț principal pentru istoricul de prețuri
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

  // Dacă prețul a fost modificat, adăugăm o nouă intrare în istoricul de prețuri
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
