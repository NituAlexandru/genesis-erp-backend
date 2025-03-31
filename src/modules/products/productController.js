// productController.js
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "./productService.js";

export async function createProductController(req, res) {
  try {
    // console.log("DEBUG createProductController -> req.body:", req.body);
    // console.log("DEBUG createProductController -> req.files:", req.files);

    const productData = {
      name: req.body.name,
      barCode: req.body.barCode,
      description: req.body.description,
      mainSupplier: req.body.mainSupplier,
      category: req.body.category,
      minStock: Number(req.body.minStock) || 0,
      currentStock: Number(req.body.currentStock) || 0,
      length: Number(req.body.length) || 0,
      width: Number(req.body.width) || 0,
      height: Number(req.body.height) || 0,
      weight: Number(req.body.weight) || 0,
      averagePurchasePrice: Number(req.body.averagePurchasePrice) || 0,
      packaging: {
        itemsPerBox: Number(req.body["packaging.itemsPerBox"]) || 0,
        boxesPerPallet: Number(req.body["packaging.boxesPerPallet"]) || 0,
        itemsPerPallet: Number(req.body["packaging.itemsPerPallet"]) || 0,
        maxPalletsPerTruck:
          Number(req.body["packaging.maxPalletsPerTruck"]) || 0,
      },
    };

    // Gestionează imaginile (placeholder)
    if (req.files && req.files.length > 0) {
      productData.image = "https://via.placeholder.com/150";
    } else {
      productData.image = "";
    }

    const newProduct = await createProduct(productData);
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
    const productData = {
      name: req.body.name,
      barCode: req.body.barCode,
      description: req.body.description,
      mainSupplier: req.body.mainSupplier,
      salesPrice: {
        price1: Number(req.body["salesPrice.price1"]) || 0,
        price2: Number(req.body["salesPrice.price2"]) || 0,
        price3: Number(req.body["salesPrice.price3"]) || 0,
      },
      minStock: Number(req.body.minStock) || 0,
      currentStock: Number(req.body.currentStock) || 0,
      firstOrderDate: req.body.firstOrderDate,
      lastOrderDate: req.body.lastOrderDate,
      length: Number(req.body.length) || 0,
      width: Number(req.body.width) || 0,
      height: Number(req.body.height) || 0,
      weight: Number(req.body.weight) || 0,
      volume: Number(req.body.volume) || 0,
      averagePurchasePrice: Number(req.body.averagePurchasePrice) || 0,
      defaultMarkups: {
        markup1: Number(req.body["defaultMarkups.markup1"]) || 0,
        markup2: Number(req.body["defaultMarkups.markup2"]) || 0,
        markup3: Number(req.body["defaultMarkups.markup3"]) || 0,
      },
      clientMarkups: req.body.clientMarkups,
    };

    if (req.files && req.files.length > 0) {
      // Similar: aici poți procesa actualizarea imaginilor
      productData.image = "https://via.placeholder.com/150";
    }

    const updatedProduct = await updateProduct(req.params.id, productData);
    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found or not updated" });
    }
    return res.json(updatedProduct);
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
