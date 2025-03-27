import VatRate from "./vatRateModel.js";
import VatRateHistory from "./vatRateHistoryModel.js";

export async function updateVatRate(req, res) {
  try {
    const { vatRate } = req.body; // ex: 0.19
    const updated = await VatRate.findOneAndUpdate(
      {},
      { vatRate },
      { new: true, upsert: true }
    );
    // Creează istoric
    await VatRateHistory.create({ vatRate });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}

export async function getVatRate(req, res) {
  try {
    let vatConfig = await VatRate.findOne({});
    if (!vatConfig) {
      vatConfig = await VatRate.create({ vatRate: 0.19 });
    }
    res.json(vatConfig);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: error.message });
  }
}
