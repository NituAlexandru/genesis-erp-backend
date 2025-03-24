import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] },
    description: { type: String },
  },
  { timestamps: true }
);

// Index pentru căutări rapide de roluri după nume
roleSchema.index({ name: 1 }, { unique: true });

const Role = mongoose.model("Role", roleSchema);

export default Role;
