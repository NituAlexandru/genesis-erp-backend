import User from "./userModel.js";
import Role from "../roles/roleModel.js";
import bcrypt from "bcryptjs";

export async function createUserService({
  username,
  name,
  email,
  password,
  role,
}) {
  // Verifică dacă utilizatorul există deja
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    throw new Error("Numele de utilizator există deja");
  }

  // Determină rolul (folosind default "Agent Vanzari" dacă roleName nu e furnizat)
  const roleDoc = role
    ? await Role.findOne({ name: role })
    : await Role.findOne({ name: "Agent Vanzari" });

  if (!roleDoc) {
    throw new Error("Rolul specificat nu există");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    name,
    email,
    password: hashedPassword,
    role: roleDoc._id,
  });

  await user.save();

  return user;
}

// Alte funcții de service pentru user (updateUser, deleteUser, getUserById, etc.) pot fi adăugate aici.
