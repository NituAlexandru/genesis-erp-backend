import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // ex.: "Administrator", "Admin", "Agent Vânzări", etc.
    permissions: {
      type: [String],
      default: [],
      // ex.: ["create_user", "delete_user", "view_reports"]
    },
    description: { type: String },
  },
  { timestamps: true }
);

const Role = mongoose.model("Role", roleSchema);

export default Role;
