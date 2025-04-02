import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
} from "./productService.js";
import Product from "./productModel.js";

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
    const oldProduct = await Product.findById(req.params.id);
    if (!oldProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Obține noile valori pentru averagePurchasePrice și markups
    const averagePurchasePrice =
      req.body.averagePurchasePrice !== undefined
        ? Number(req.body.averagePurchasePrice)
        : oldProduct.averagePurchasePrice;

    const markup1 =
      req.body["defaultMarkups.markup1"] !== undefined
        ? Number(req.body["defaultMarkups.markup1"])
        : oldProduct.defaultMarkups.markup1;
    const markup2 =
      req.body["defaultMarkups.markup2"] !== undefined
        ? Number(req.body["defaultMarkups.markup2"])
        : oldProduct.defaultMarkups.markup2;
    const markup3 =
      req.body["defaultMarkups.markup3"] !== undefined
        ? Number(req.body["defaultMarkups.markup3"])
        : oldProduct.defaultMarkups.markup3;

    // Recalculează prețurile de vânzare pe baza valorilor obținute
    const salesPrice = {
      price1: parseFloat(
        (averagePurchasePrice * (1 + markup1 / 100)).toFixed(2)
      ),
      price2: parseFloat(
        (averagePurchasePrice * (1 + markup2 / 100)).toFixed(2)
      ),
      price3: parseFloat(
        (averagePurchasePrice * (1 + markup3 / 100)).toFixed(2)
      ),
    };

    // Pregătește actualizarea pentru câmpul packaging
    const packaging = {
      itemsPerBox:
        req.body["packaging.itemsPerBox"] !== undefined
          ? Number(req.body["packaging.itemsPerBox"])
          : oldProduct.packaging.itemsPerBox,
      boxesPerPallet:
        req.body["packaging.boxesPerPallet"] !== undefined
          ? Number(req.body["packaging.boxesPerPallet"])
          : oldProduct.packaging.boxesPerPallet,
      itemsPerPallet:
        req.body["packaging.itemsPerPallet"] !== undefined
          ? Number(req.body["packaging.itemsPerPallet"])
          : oldProduct.packaging.itemsPerPallet,
      maxPalletsPerTruck:
        req.body["packaging.maxPalletsPerTruck"] !== undefined
          ? Number(req.body["packaging.maxPalletsPerTruck"])
          : oldProduct.packaging.maxPalletsPerTruck,
    };

    // Construiește obiectul de update pentru produs
    const productData = {
      name: req.body.name || oldProduct.name,
      barCode: req.body.barCode || oldProduct.barCode,
      description: req.body.description || oldProduct.description,
      mainSupplier: req.body.mainSupplier || oldProduct.mainSupplier,
      category: req.body.category || oldProduct.category,
      // Setează prețurile de vânzare calculate
      salesPrice: salesPrice,
      minStock:
        req.body.minStock !== undefined
          ? Number(req.body.minStock)
          : oldProduct.minStock,
      currentStock:
        req.body.currentStock !== undefined
          ? Number(req.body.currentStock)
          : oldProduct.currentStock,
      firstOrderDate: req.body.firstOrderDate || oldProduct.firstOrderDate,
      lastOrderDate: req.body.lastOrderDate || oldProduct.lastOrderDate,
      length:
        req.body.length !== undefined
          ? Number(req.body.length)
          : oldProduct.length,
      width:
        req.body.width !== undefined
          ? Number(req.body.width)
          : oldProduct.width,
      height:
        req.body.height !== undefined
          ? Number(req.body.height)
          : oldProduct.height,
      weight:
        req.body.weight !== undefined
          ? Number(req.body.weight)
          : oldProduct.weight,
      volume:
        req.body.volume !== undefined
          ? Number(req.body.volume)
          : oldProduct.volume,
      averagePurchasePrice: averagePurchasePrice,
      defaultMarkups: {
        markup1: markup1,
        markup2: markup2,
        markup3: markup3,
      },
      clientMarkups: req.body.clientMarkups || oldProduct.clientMarkups,
      packaging: packaging, // Actualizează câmpul packaging
    };

    // Gestionează imaginile, dacă sunt furnizate
    if (req.files && req.files.length > 0) {
      productData.image = "https://via.placeholder.com/150";
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: productData },
      { new: true }
    );
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

export async function softDeleteProductController(req, res) {
  try {
    const product = await softDeleteProduct(req.params.id);
    if (!product) {
      return res.status(404).json({ msg: "Product not found or not updated" });
    }
    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}
