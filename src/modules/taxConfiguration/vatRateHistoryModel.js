import mongoose from "mongoose";

const vatRateHistorySchema = new mongoose.Schema({
  vatRate: { type: Number, required: true }, // valoarea TVA ca fracție (ex: 0.19 pentru 19%)
  effectiveDate: { type: Date, default: Date.now }, // data la care a intrat în vigoare această valoare
});

const VatRateHistory = mongoose.model("VatRateHistory", vatRateHistorySchema);

export default VatRateHistory;
