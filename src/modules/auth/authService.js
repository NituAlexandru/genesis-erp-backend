import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Citim variabilele de mediu la început
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
const ACCESS_TOKEN_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m"; 
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d"; 

// Verificăm dacă secretele JWT sunt definite
if (!JWT_SECRET) {
  throw new Error(
    "FATAL ERROR: JWT_SECRET is not defined in environment variables."
  );
}
if (!JWT_REFRESH_SECRET) {
  throw new Error(
    "FATAL ERROR: JWT_REFRESH_SECRET is not defined in environment variables."
  );
}

export async function hashPassword(password) {
  if (!password) throw new Error("Password cannot be empty.");
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false; 
  return bcrypt.compare(plainPassword, hashedPassword);
}

export function generateAccessToken(payload) {
  // Verifică dacă payload-ul este valid (minim userId și username)
  if (!payload || !payload.userId || !payload.username) {
    throw new Error("Invalid payload for generating access token.");
  }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
}

export function generateRefreshToken(payload) {
  // Verifică dacă payload-ul este valid
  if (!payload || !payload.userId || !payload.username) {
    throw new Error("Invalid payload for generating refresh token.");
  }
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });
}

// Funcțiile de verificare sunt folosite în middleware, deci le păstrăm aici
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    // Nu arunca eroarea direct, lasă middleware-ul să o gestioneze
    console.error("Access token verification failed:", error.message);
    throw error; // Re-aruncă eroarea originală (ex. TokenExpiredError)
  }
}

export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  } catch (error) {
    console.error("Refresh token verification failed:", error.message);
    throw error; // Re-aruncă eroarea originală
  }
}
