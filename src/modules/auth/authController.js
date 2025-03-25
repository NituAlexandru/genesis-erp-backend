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

    // Aici se salvează referința la rol, care este preluată din DB
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

    // Populăm câmpul "role" pentru a obține detaliile din documentul Role
    let user = await User.findOne({ username }).populate(
      "role",
      "name permissions"
    );
    if (!user)
      return res.status(400).json({ msg: "Utilizator sau parolă incorectă" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ msg: "Utilizator sau parolă incorectă" });

    // Generăm tokenul și includem username-ul în payload
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role ? user.role.name : null,
        permissions: user.role ? user.role.permissions : [],
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Setăm tokenul într-un cookie HTTP-only
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // Ajustează pentru producție
      secure: false, // Pe localhost
    });
    res.json({
      token,
      role: user.role ? user.role.name : null,
      permissions: user.role ? user.role.permissions : [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};

// logout

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // setează true în producție
      sameSite: "lax",
    });
    res.json({ msg: "Logout successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Logout failed" });
  }
};

// getMe - Verifică cookie-ul și returnează datele userului din token
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({
      userId: decoded.userId,
      username: decoded.username,
      role: decoded.role,
      permissions: decoded.permissions || [],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Eroare server" });
  }
};
