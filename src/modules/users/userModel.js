import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    name: { type: String, required: false },
    email: { type: String, required: false },
    password: { type: String, required: true },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    // permissions: {
    //   type: [String],
    //   default: [],
    // },
    // phone number
    // combinat role + permissions? sa folosesc doar role?
    // renunt la seedRoleScript? si fac model? ca sa se atribuie si roluri separat?
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
