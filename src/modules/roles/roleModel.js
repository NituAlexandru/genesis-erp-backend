import mongoose from "mongoose";

// Definirea schemei pentru documentul "Role" în MongoDB
const roleSchema = new mongoose.Schema(
  {
    // Numele rolului (obligatoriu și unic)
    name: { type: String, required: true, unique: true },
    // Lista de permisiuni asociate rolului; implicit este un array gol
    permissions: { type: [String], default: [] },
    // Descrierea rolului (opțional)
    description: { type: String },
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt"
);

// Crearea unui index unic pe câmpul "name" pentru căutări rapide
roleSchema.index({ name: 1 }, { unique: true });

// Crearea modelului "Role" folosind schema definită
const Role = mongoose.model("Role", roleSchema);

// Exportarea modelului pentru a putea fi utilizat în alte module
export default Role;
