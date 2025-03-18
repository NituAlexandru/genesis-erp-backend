import User from "./userModel.js";
import Role from "../roles/roleModel.js";
import bcrypt from "bcryptjs";

// Endpoint pentru crearea unui nou utilizator
export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    let user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ msg: "Numele de utilizator există deja" });

    // Dacă role nu este furnizat, se folosește rolul implicit "Agent Vânzări"
    const roleDoc = role
      ? await Role.findOne({ name: role })
      : await Role.findOne({ name: "Agent Vânzări" });

    if (!roleDoc)
      return res.status(400).json({ msg: "Rolul specificat nu există" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({
      username,
      name,
      email,
      password: hashedPassword,
      role: roleDoc._id,
    });
    await user.save();

    res
      .status(201)
      .json({ msg: `Utilizatorul ${username} a fost creat cu succes` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// Endpoint pentru obținerea unui utilizator după ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("role", "name permissions");
    if (!user)
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// Nou: Endpoint pentru obținerea unui utilizator după username
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).populate(
      "role",
      "name permissions"
    );
    if (!user)
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// Endpoint pentru actualizarea unui utilizator (nu se permite schimbarea username-ului)
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    // Căutăm utilizatorul
    let user = await User.findById(id);
    if (!user)
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });

    // Actualizăm câmpurile permise
    user.name = name || user.name;
    user.email = email || user.email;
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }
    if (role) {
      // Căutăm documentul rolului după nume
      const roleDoc = await Role.findOne({ name: role });
      if (!roleDoc)
        return res.status(400).json({ msg: "Rolul specificat nu există" });

      // Verificăm dacă utilizatorul are deja acel rol
      if (roleDoc._id.toString() === user.role.toString()) {
        return res.status(400).json({ msg: "Utilizatorul are deja acest rol" });
      }

      user.role = roleDoc._id;
    }
    await user.save();
    res.json({ msg: "Utilizator actualizat cu succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// Endpoint pentru ștergerea unui utilizator
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user)
      return res.status(404).json({ msg: "Utilizatorul nu a fost găsit" });
    res.json({ msg: "Utilizator șters cu succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};
