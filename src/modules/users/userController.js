import User from "./userModel.js";
import Role from "../roles/roleModel.js";
import bcrypt from "bcryptjs";

export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, roleName } = req.body;

    let user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ msg: "Numele de utilizator există deja" });

    // Setează rolul: dacă roleName nu este furnizat, folosește default "Agent Vânzări"
    const roleDoc = roleName
      ? await Role.findOne({ name: roleName })
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

    res.status(201).json({ msg: "Utilizator creat cu succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};
