import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String }, // Optional
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["Administrator", "Admin", "Agent Vânzări", "Șofer", "Manipulator Depozit"],
      default: "Agent Vânzări",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
