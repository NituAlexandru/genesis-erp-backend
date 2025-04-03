import User from "./userModel.js";
import Role from "../roles/roleModel.js"; 
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10; 

export async function createUserService({
  username,
  name,
  email,
  password,
  roleName,
}) {

  // Găsește rolul pe baza numelui furnizat
  const roleDoc = await Role.findOne({ name: roleName });

  if (!roleDoc) {
    // Aruncă o eroare specifică pe care controllerul o poate prinde
    const err = new Error(`Rolul specificat "${roleName}" nu există.`);
    err.status = 400; // Setează un status code pentru eroare
    throw err;
  }

  // Hash parola
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Creează instanța User
  const user = new User({
    username,
    name,
    email,
    password: hashedPassword,
    role: roleDoc._id, // Folosește ID-ul rolului găsit
  });

  // Salvează utilizatorul (eventualele erori de validare Mongoose vor fi aruncate aici)
  await user.save();

  // Returnează utilizatorul salvat (fără parolă)
  // Convertim la obiect simplu pentru a putea șterge parola
  const userObject = user.toObject();
  delete userObject.password;

  return userObject;
}

// --- Alte funcții de service ---

export async function findUserById(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  // Exclude parola și populează rolul cu nume și permisiuni
  return await User.findById(userId)
    .select("-password")
    .populate("role", "name permissions");
}

export async function findUserByUsername(username) {
  // Exclude parola și populează rolul cu nume și permisiuni
  return await User.findOne({ username })
    .select("-password")
    .populate("role", "name permissions");
}

export async function updateUserService(userId, updateData) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error(`ID utilizator invalid.`);
    err.status = 400;
    throw err;
  }

  const { roleName, password, ...otherUpdates } = updateData;
  const dataToUpdate = { ...otherUpdates };

  // Gestionează actualizarea rolului
  if (roleName) {
    const roleDoc = await Role.findOne({ name: roleName });
    if (!roleDoc) {
      const err = new Error(`Rolul specificat "${roleName}" nu există.`);
      err.status = 400;
      throw err;
    }
    dataToUpdate.role = roleDoc._id;
  }

  // Gestionează actualizarea parolei
  if (password) {
    if (password.length < 6) {
      const err = new Error(`Parola trebuie să aibă cel puțin 6 caractere.`);
      err.status = 400;
      throw err;
    }
    dataToUpdate.password = await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Găsește și actualizează utilizatorul
  // new: true - returnează documentul actualizat
  // runValidators: true - aplică validările din schema Mongoose la actualizare
  const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdate, {
    new: true,
    runValidators: true,
  })
    .select("-password")
    .populate("role", "name"); // Exclude parola și populează rolul

  if (!updatedUser) {
    const err = new Error(
      `Utilizatorul cu ID ${userId} nu a fost găsit pentru actualizare.`
    );
    err.status = 404;
    throw err;
  }

  return updatedUser.toObject(); // Returnează obiect simplu
}

export async function deleteUserService(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    const err = new Error(`ID utilizator invalid.`);
    err.status = 400;
    throw err;
  }

  const deletedUser = await User.findByIdAndDelete(userId);

  if (!deletedUser) {
    const err = new Error(
      `Utilizatorul cu ID ${userId} nu a fost găsit pentru ștergere.`
    );
    err.status = 404;
    throw err;
  }

  // Returnează utilizatorul șters (fără parolă) pentru confirmare
  const userObject = deletedUser.toObject();
  delete userObject.password;
  return userObject;
}
