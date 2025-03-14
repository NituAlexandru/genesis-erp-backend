import User from "../users/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Admin-created user registration
export const createUser = async (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;

    let user = await User.findOne({ username });
    if (user)
      return res.status(400).json({ msg: "Numele de utilizator există deja" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ username, name, email, password: hashedPassword, role });
    await user.save();

    res.status(201).json({ msg: "Utilizator creat cu succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// Login with username & password
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user)
      return res.status(400).json({ msg: "Utilizator sau parolă incorectă" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Utilizator sau parolă incorectă" });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.json({ token, role: user.role });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};
