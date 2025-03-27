import Product from "../products/productModel.js";

export async function updateProductMarkups(req, res) {
  try {
    // Așteptăm ca request-ul să conțină: { productId, defaultMarkups }
    const { productId, defaultMarkups } = req.body;

    // Actualizează produsul folosind _id-ul
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $set: { defaultMarkups } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ msg: "Product not found" });
    }
    return res.json(updatedProduct);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}
