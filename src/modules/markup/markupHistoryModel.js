import mongoose from "mongoose";

const markupHistorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  defaultMarkups: {
    markup1: { type: Number, required: true },
    markup2: { type: Number, required: true },
    markup3: { type: Number, required: true },
  },
  effectiveDate: { type: Date, default: Date.now },
});

const MarkupHistory = mongoose.model("MarkupHistory", markupHistorySchema);
export default MarkupHistory;
