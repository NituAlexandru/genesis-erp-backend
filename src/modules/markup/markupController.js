import Product from "../products/productModel.js";
import MarkupHistory from "./markupHistoryModel.js";

export async function updateProductMarkups(req, res) {
  try {
    const { productId, defaultMarkups } = req.body;

    // Încarcă produsul pentru a calcula prețurile de vânzare
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ msg: "Product not found" });
    }

    // Actualizează marjele implicite
    product.defaultMarkups = defaultMarkups;

    // Calculează prețurile de vânzare
    const avgPrice = product.averagePurchasePrice;
    product.salesPrice.price1 = avgPrice * (1 + defaultMarkups.markup1 / 100);
    product.salesPrice.price2 = avgPrice * (1 + defaultMarkups.markup2 / 100);
    product.salesPrice.price3 = avgPrice * (1 + defaultMarkups.markup3 / 100);

    // Salvează produsul actualizat
    await product.save();

    // Salvează și în istoric markup (opțional)
    await MarkupHistory.create({
      product: productId,
      defaultMarkups,
    });

    return res.json(product);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: error.message });
  }
}
