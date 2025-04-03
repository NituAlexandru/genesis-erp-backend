import User from "../users/userModel.js";
import {
  verifyPassword,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "./authService.js";
import { validationResult } from "express-validator";
import mongoose from "mongoose";

// --- Login ---
export const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { username, password } = req.body;
    // Găsește utilizatorul și populează rolul (nume și permisiuni)
    const user = await User.findOne({ username }).populate(
      "role",
      "name permissions"
    );
    if (!user) {
      console.log(`Login attempt failed: User ${username} not found.`);
      return res.status(401).json({ msg: "Utilizator sau parolă incorectă" }); // 401 Unauthorized
    }
    // Verifică parola
    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      console.log(
        `Login attempt failed: Invalid password for user ${username}.`
      );
      return res.status(401).json({ msg: "Utilizator sau parolă incorectă" }); // 401 Unauthorized
    }
    // Verifică dacă rolul a fost populat corect
    const roleName = user.role ? user.role.name : null;
    const permissions = user.role ? user.role.permissions || [] : [];
    if (!roleName) {
      console.warn(
        `User ${username} logged in but has missing/unpopulated role.`
      );
      // return res.status(500).json({ msg: "User role configuration error." });
    }
    // Payload-ul pentru token-uri
    const payload = {
      userId: user._id.toString(),
      username: user.username,
      role: roleName,
      permissions: permissions,
    };
    // Generează token-urile
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    // Setează opțiunile pentru cookie-uri
    const cookieOptions = {
      httpOnly: true, // Esențial pentru securitate
      secure: process.env.NODE_ENV === "production", // true în producție
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' necesită secure: true
      path: "/", // Aplică cookie-ul pentru întreg site-ul
    };
    // Setează cookie-ul pentru access token (durată scurtă)
    res.cookie("token", accessToken, cookieOptions);
    // Setează cookie-ul pentru refresh token (durată lungă)
    const refreshExpires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expiră în 7 zile
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      expires: refreshExpires,
    });
    console.log(`User ${username} logged in successfully. Role: ${roleName}`);
    // Răspunde cu datele utilizatorului (FĂRĂ token)
    res.json({
      msg: "Login successful",
      userId: payload.userId,
      username: payload.username,
      role: payload.role,
      permissions: payload.permissions,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    next(error); // Pasează eroarea generală
  }
};

// --- Logout ---
export const logout = async (req, res, next) => {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };
    // Șterge cookie-urile setând o dată de expirare în trecut
    res.clearCookie("token", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
    console.log(`Logout successful for user previously identified by cookies.`);
    res.status(200).json({ msg: "Logout successful" }); // Trimite 200 OK
  } catch (error) {
    console.error("Logout controller error:", error);
    next(error);
  }
};

// --- Get Me (Get Current User Data) ---
export const getMe = async (req, res, next) => {
  // authMiddleware ar trebui să fi rulat înainte și să fi setat req.user
  if (!req.user) {
    console.warn("getMe called but req.user is not set by authMiddleware.");
    return res
      .status(401)
      .json({ msg: "Not authenticated or user data missing in request." });
  }
  try {
    // Re-verifica dacă userul încă există în DB
    const userExists = await User.findById(req.user.userId).lean();
    if (!userExists) {
      console.warn(
        `getMe: User ${req.user.userId} from token not found in DB.`
      );
      // Curăță cookie-urile dacă userul nu mai există
      const clearCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      };
      res.clearCookie("token", clearCookieOptions);
      res.clearCookie("refreshToken", clearCookieOptions);
      return res
        .status(401)
        .json({ msg: "User associated with token no longer exists." });
    }

    // Trimitem datele din token (care au fost deja validate de middleware)
    console.log(`getMe successful for user: ${req.user.username}`);
    res.json({
      userId: req.user.userId,
      username: req.user.username,
      role: req.user.role,
      permissions: req.user.permissions || [],
    });
  } catch (error) {
    console.error("getMe controller error:", error);
    next(error);
  }
};

// --- Refresh Token ---
export const refreshToken = async (req, res, next) => {
  const refreshTokenCookie = req.cookies.refreshToken;
  if (!refreshTokenCookie) {
    console.log("Refresh token attempt failed: No refresh token cookie found.");
    return res
      .status(401)
      .json({ msg: "Not authenticated: Refresh token missing." });
  }

  try {
    const decoded = verifyRefreshToken(refreshTokenCookie);
    // Găsește utilizatorul din DB pentru a prelua cele mai recente date (rol, permisiuni)
    const user = await User.findById(decoded.userId).populate(
      "role",
      "name permissions"
    );
    if (!user) {
      console.log(
        `Refresh token failed: User ${decoded.userId} not found in DB.`
      );
      const clearCookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",
      };
      res.clearCookie("token", clearCookieOptions);
      res.clearCookie("refreshToken", clearCookieOptions);
      return res
        .status(401)
        .json({ msg: "User associated with refresh token no longer exists." });
    }

    // Creează noul payload cu date actualizate
    const roleName = user.role ? user.role.name : null;
    const permissions = user.role ? user.role.permissions || [] : [];
    const newPayload = {
      userId: user._id.toString(),
      username: user.username,
      role: roleName,
      permissions: permissions,
    };

    // Generează un nou access token
    const newAccessToken = generateAccessToken(newPayload);

    // Setează cookie-ul pentru noul access token
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };
    res.cookie("token", newAccessToken, cookieOptions);

    console.log(
      `Access token refreshed successfully for user: ${user.username}`
    );

    // Răspunde cu succes (FĂRĂ token)
    res.status(200).json({
      msg: "Token refreshed successfully",
    });
  } catch (error) {
    console.error("Refresh token controller error:", error.message);
    // Curăță cookie-urile dacă refresh token-ul este invalid/expirat
    const clearCookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };
    res.clearCookie("token", clearCookieOptions);
    res.clearCookie("refreshToken", clearCookieOptions);
    // Pasează eroarea (va fi prinsă de error handlerul general) sau trimite direct 401
    // next(error); // Ar putea duce la 500 dacă nu e tratat specific
    return res.status(401).json({ msg: "Refresh token invalid or expired." });
  }
};
