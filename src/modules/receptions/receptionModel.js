import mongoose from "mongoose";

// Definirea schemei pentru documentul "Reception" (receptie) în MongoDB
const receptionSchema = new mongoose.Schema(
  {
    // Utilizatorul care a realizat recepția (cine a introdus datele de recepție)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Leagă acest câmp de modelul "User"
      required: true, // Câmp obligatoriu
    },
    // Referință la furnizorul care a efectuat livrarea
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier", // Leagă acest câmp de modelul "Supplier"
      required: true, // Câmp obligatoriu
    },
    // Lista de produse recepționate
    products: [
      {
        // Referință la produsul recepționat
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Leagă acest câmp de modelul "Product"
        },
        // Cantitatea produsului recepționat (obligatoriu)
        quantity: {
          type: Number,
          required: true,
        },
        // Unitatea de măsură a produsului (ex: "buc", "kg", "palet")
        unitMeasure: {
          type: String,
          required: true,
        },
        // Prețul de intrare (achiziție) al produsului la momentul recepției
        priceAtReception: {
          type: Number,
          default: null,
        },
      },
    ],
    // Data la care a avut loc recepția; implicit se setează data curentă
    receptionDate: {
      type: Date,
      default: Date.now,
    },
    // Numele șoferului care a efectuat livrarea (opțional)
    driverName: {
      type: String,
      required: false,
    },
    // Numărul autoturismului sau al vehiculului de livrare (opțional)
    carNumber: {
      type: String,
      required: false,
    },
    // Statusul recepției, care poate fi "Draft" (în curs de editare) sau "Final" (complet finalizată)
    status: {
      type: String,
      default: "Draft",
      enum: ["Draft", "Final"],
    },
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt" la fiecare document
);

// Crearea indexurilor pentru îmbunătățirea performanței interogărilor
receptionSchema.index({ createdBy: 1 }); // Index pe câmpul "createdBy" pentru căutări rapide după utilizator
receptionSchema.index({ supplier: 1 }); // Index pe câmpul "supplier" pentru căutări rapide după furnizor
receptionSchema.index({ receptionDate: 1 }); // Index pe câmpul "receptionDate" pentru interogări pe intervale de timp
receptionSchema.index({ status: 1 }); // Index pe câmpul "status" pentru filtrări rapide după status

// Crearea modelului "Reception" folosind schema definită
const Reception = mongoose.model("Reception", receptionSchema);

// Exportarea modelului pentru a putea fi utilizat în alte module ale aplicației
export default Reception;
