import * as userService from "./userService.js"; // Importăm toate funcțiile din service
import { validationResult } from "express-validator";
import mongoose from "mongoose"; // Import mongoose

// POST /api/users - Creare utilizator
export const createUser = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Extrage datele validate din body
    const { username, name, email, password, roleName } = req.body;
    // Apelează funcția de service pentru a crea utilizatorul
    const newUser = await userService.createUserService({
      username,
      name,
      email,
      password,
      roleName,
    });

    console.log(
      `User ${username} created successfully by ${
        req.user?.username || "system"
      }.`
    );
    // Răspunde cu succes și datele utilizatorului creat (fără parolă)
    res.status(201).json({
      msg: `Utilizatorul "${username}" a fost creat cu succes.`,
      user: newUser, // Service-ul returnează deja userul fără parolă
    });
  } catch (error) {
    console.error("Error in createUser controller:", error.message);
    // Pasăm eroarea către middleware-ul de erori general
    // Setăm statusul implicit dacă nu e definit în eroare
    error.status = error.status || 500;
    // Prindem erorile specifice de duplicat din Mongoose
    if (error.code === 11000) {
      error.status = 400;
      // Determină câmpul duplicat
      const field = Object.keys(error.keyValue)[0];
      error.message = `A user with this ${field} already exists.`;
    }
    next(error); // Pasează eroarea mai departe
  }
};

// GET /api/users/:id - Obținere utilizator după ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Verificare validitate ObjectId direct în controller
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID utilizator invalid" });
    }
    const user = await userService.findUserById(id);
    if (!user) {
      // Trimite 404 dacă utilizatorul nu este găsit
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });
    }
    // Răspunde cu datele utilizatorului
    res.json(user);
  } catch (error) {
    console.error("Error in getUserById controller:", error.message);
    next(error); // Pasează eroarea
  }
};

// GET /api/users/username/:username - Obținere utilizator după username
export const getUserByUsername = async (req, res, next) => {
  try {
    const { username } = req.params;
    const user = await userService.findUserByUsername(username);
    if (!user) {
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error in getUserByUsername controller:", error.message);
    next(error); // Pasează eroarea
  }
};

// PUT /api/users/:id - Actualizare utilizator
export const updateUser = async (req, res, next) => {
  // Verifică erorile de validare
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { id } = req.params;
    // Extrage doar câmpurile permise pentru actualizare din body
    const { name, email, password, roleName } = req.body;
    const updateData = { name, email, password, roleName };
    // Elimină câmpurile nedefinite pentru a nu suprascrie cu null/undefined
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );
    // Verifică dacă există date de actualizat
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ msg: "No update data provided." });
    }
    // Apeleză service-ul pentru actualizare
    const updatedUser = await userService.updateUserService(id, updateData);
    console.log(
      `User ${updatedUser.username} updated successfully by ${req.user?.username}.`
    );
    res.json({ msg: "Utilizator actualizat cu succes", user: updatedUser });
  } catch (error) {
    console.error("Error in updateUser controller:", error.message);
    // Prindem erorile specifice de duplicat din Mongoose la update
    if (error.code === 11000) {
      error.status = 400;
      const field = Object.keys(error.keyValue)[0];
      error.message = `Another user with this ${field} already exists.`;
    }
    next(error); // Pasează eroarea
  }
};

// DELETE /api/users/:id - Ștergere utilizator
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    // Verificare validitate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "ID utilizator invalid" });
    }
    // Prevenire auto-ștergere (dacă req.user este setat de middleware)
    if (req.user && req.user.userId === id) {
      return res
        .status(400)
        .json({ msg: "Acțiune interzisă: Nu te poți șterge singur." });
    }
    const deletedUser = await userService.deleteUserService(id);
    console.log(
      `User ${deletedUser.username} deleted successfully by ${req.user?.username}.`
    );
    res.json({
      msg: `Utilizatorul "${deletedUser.username}" a fost șters cu succes.`,
    });
  } catch (error) {
    console.error("Error in deleteUser controller:", error.message);
    next(error); // Pasează eroarea
  }
};
