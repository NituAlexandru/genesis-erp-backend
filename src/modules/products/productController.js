import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./productService.js";

export async function createProductController(req, res) {
  try {
    const newProduct = await createProduct(req.body);
    return res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}

export async function getAllProductsController(req, res) {
  try {
    const products = await getAllProducts(req.query);
    return res.json(products);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}

export async function getProductByIdController(req, res) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}

export async function updateProductController(req, res) {
  try {
    const updated = await updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ msg: "Product not found or not updated" });
    }
    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}

export async function deleteProductController(req, res) {
  try {
    const deleted = await deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({ msg: "Product not found" });
    }
    return res.json(deleted);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}
