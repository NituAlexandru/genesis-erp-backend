import Product from "../products/productModel.js";
import MarkupHistory from "./markupHistoryModel.js";

export async function updateProductMarkups(req, res) {
  try {
    const { productId, defaultMarkups } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { defaultMarkups } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Salvează istoric markup
    await MarkupHistory.create({
      product: productId,
      defaultMarkups,
    });

    return res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}
