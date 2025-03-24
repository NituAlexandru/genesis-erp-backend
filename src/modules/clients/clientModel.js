import mongoose from "mongoose";

// Definirea schemei pentru documentul "Client" în MongoDB
const clientSchema = new mongoose.Schema(
  {
    // Numele clientului (obligatoriu)
    name: {
      type: String,
      required: true,
    },
    // Cod Numeric Personal (CNP) pentru persoane fizice (opțional)
    cnp: {
      type: String,
      required: false,
    },
    // Cod Unic de Înregistrare (CUI) pentru persoane juridice (opțional)
    cui: {
      type: String,
      required: false,
    },
    // Număr de înregistrare la Registrul Comerțului (opțional)
    nrRegComert: {
      type: String,
      required: false,
    },
    // Tipul clientului, care poate fi "persoana fizica" sau "persoana juridica" (obligatoriu)
    clientType: {
      type: String, // valorile pot fi "fizica" sau "juridica"
      required: true,
      enum: ["persoana fizica", "persoana juridica"],
    },
    // Adresa de email a clientului (opțional)
    email: {
      type: String,
      required: false,
    },
    // Numărul de telefon al clientului (opțional)
    phone: {
      type: String,
      required: false,
    },
    // Adresa clientului (opțional)
    address: {
      type: String,
      required: false,
    },
    // Codul IBAN asociat clientului (opțional)
    iban: {
      type: String,
      required: false,
    },
    // Referințe către alte documente asociate clientului
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order", // face referință către modelul "Order"
      },
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice", // face referință către modelul "Invoice"
      },
    ],
    avizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aviz", // face referință către modelul "Aviz"
      },
    ],
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery", // face referință către modelul "Delivery"
      },
    ],
    // Câmpuri denormalizate pentru a îmbunătăți scalabilitatea și performanța
    totalOrders: { type: Number, default: 0 }, // numărul total de comenzi efectuate
    totalSales: { type: Number, default: 0 }, // vânzări totale realizate
    totalDeliveries: { type: Number, default: 0 }, // numărul total de livrări
    totalProfit: { type: Number, default: 0 }, // profitul total generat
    totalCosts: { type: Number, default: 0 }, // costurile totale suportate
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt"
);

// Crearea indexurilor pe câmpurile utilizate frecvent la căutări
clientSchema.index({ cnp: 1 }, { sparse: true }); // Index pe CNP, indexând doar documentele care au acest câmp
clientSchema.index({ cui: 1 }, { sparse: true }); // Index pe CUI, indexând doar documentele care au acest câmp
clientSchema.index({ phone: 1 }, { sparse: true }); // Index pe numărul de telefon, indexând doar documentele care au acest câmp
clientSchema.index({ email: 1 }, { sparse: true }); // Index pe email, indexând doar documentele care au acest câmp

// Crearea modelului "Client" folosind schema definită
const Client = mongoose.model("Client", clientSchema);

// Exportarea modelului pentru a putea fi utilizat în alte module
export default Client;
