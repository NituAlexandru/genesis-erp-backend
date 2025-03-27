import VatRate from "./vatRateModel.js";

export async function updateVatRate(req, res) {
  try {
    const { vatRate } = req.body;

    const updated = await VatRate.findOneAndUpdate(
      {},
      { vatRate },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

//  * Obține valoarea curentă a TVA

export async function getVatRate(req, res) {
  try {
    // Presupunem că avem un singur document
    let vatConfig = await VatRate.findOne({});
    if (!vatConfig) {
      // Dacă nu există, îl creăm cu un default
      vatConfig = await VatRate.create({ vatRate: 0.19 });
    }
    res.json(vatConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}
