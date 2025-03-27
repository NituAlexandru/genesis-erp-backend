import mongoose from "mongoose";

const taxSchema = new mongoose.Schema({
  vatRate: { type: Number, required: true },
});

const TaxConfiguration = mongoose.model("TaxConfiguration", taxSchema);
export default TaxConfiguration;
