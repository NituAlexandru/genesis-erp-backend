import mongoose from "mongoose";

const vatRateSchema = new mongoose.Schema({
  vatRate: { type: Number, required: true }, // stocăm valoarea TVA ca fracție (ex. 0.19 pentru 19%)
});

const VatRate = mongoose.model("VatRate", vatRateSchema);
export default VatRate;
