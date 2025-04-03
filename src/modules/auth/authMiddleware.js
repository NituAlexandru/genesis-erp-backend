import { verifyAccessToken, verifyRefreshToken } from "./authService.js"; // Importăm ambele
import jwt from "jsonwebtoken"; // Importăm jwt pentru a verifica tipul erorii

// --- Middleware Principal de Autentificare ---
export function authMiddleware(req, res, next) {
  const token = req.cookies.token; // Preluăm token-ul de acces din cookie

  if (!token) {
    console.log("AuthMiddleware: No token cookie found.");
    // Returnăm 401 doar dacă știm sigur că ruta necesită autentificare
    // Pentru rute ca /refresh, am putea lăsa controllerul să decidă, dar aici presupunem că e necesar
    return res
      .status(401)
      .json({ msg: "Not authenticated: No token provided." });
  }

  try {
    // Verificăm token-ul de acces folosind funcția din authService
    const decoded = verifyAccessToken(token);
    // Atașăm payload-ul decodat la request
    req.user = decoded; // Conține userId, username, role, permissions
    console.log(
      `AuthMiddleware: Token verified for user ${req.user.username}.`
    );
    next(); // Trecem la următorul handler
  } catch (error) {
    // Tratăm erorile specifice JWT
    if (error instanceof jwt.TokenExpiredError) {
      console.log("AuthMiddleware: Access token expired.");
      // Trimitem un cod specific pentru frontend, dacă e util
      return res
        .status(401)
        .json({ msg: "Access token expired", code: "TOKEN_EXPIRED" });
    } else if (error instanceof jwt.JsonWebTokenError) {
      console.log("AuthMiddleware: Invalid token.");
      return res.status(401).json({ msg: "Invalid token" });
    } else {
      // Alte erori neașteptate
      console.error("AuthMiddleware: Unexpected error verifying token:", error);
      return res
        .status(500)
        .json({ msg: "Server error during token verification." });
    }
  }
}

// --- Middleware pentru Verificarea Permisiunilor ---
export function checkPermission(permission) {
  // Returnează funcția middleware efectivă
  return (req, res, next) => {
    // Verifică dacă req.user și permisiunile există (setate de authMiddleware)
    if (!req.user || !req.user.permissions) {
      console.log(
        `Permission Check Failed: User data or permissions missing. Required: ${permission}`
      );
      // Trimite 403 Forbidden dacă datele necesare lipsesc
      return res.status(403).json({
        msg: "Forbidden: Insufficient user data for permission check.",
      });
    }

    // Verifică dacă array-ul de permisiuni include permisiunea necesară
    if (!req.user.permissions.includes(permission)) {
      console.log(
        `Permission Check Failed: User ${req.user.username} lacks permission: ${permission}`
      );
      // Trimite 403 Forbidden dacă permisiunea lipsește
      return res
        .status(403)
        .json({ msg: `Forbidden: Requires permission '${permission}'.` });
    }

    // Dacă permisiunea există, trecem mai departe
    console.log(
      `Permission Check Granted: User ${req.user.username} has permission: ${permission}`
    );
    next();
  };
}

// --- Middleware pentru Verificarea Rolului Admin sau Administrator ---
export function checkAdminOrAdministrator(req, res, next) {
  // Verifică dacă req.user și rolul există
  if (!req.user || !req.user.role) {
    console.log("Admin Check Failed: User data or role missing.");
    return res
      .status(403)
      .json({ msg: "Forbidden: Insufficient user data for role check." });
  }

  // Verifică dacă rolul este unul dintre cele permise
  const allowedRoles = ["Admin", "Administrator"]; // Definește rolurile permise
  if (!allowedRoles.includes(req.user.role)) {
    console.log(
      `Admin Check Failed: User ${req.user.username} has role '${
        req.user.role
      }'. Required: ${allowedRoles.join(" or ")}`
    );
    return res
      .status(403)
      .json({ msg: `Forbidden: Requires role ${allowedRoles.join(" or ")}.` });
  }

  // Dacă rolul este permis, trecem mai departe
  console.log(
    `Admin Check Granted: User ${req.user.username} has role '${req.user.role}'.`
  );
  next();
}
