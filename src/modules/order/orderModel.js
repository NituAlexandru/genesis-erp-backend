import mongoose from "mongoose";

// Definirea schemei pentru documentul "Order" în MongoDB
const orderSchema = new mongoose.Schema(
  {
    // Clientul către care se face vânzarea
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client", // Leagă acest câmp de modelul "Client"
      required: true,
    },
    // Utilizatorul care a creat comanda (ex.: Agent Vânzări sau alt utilizator)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Leagă acest câmp de modelul "User"
      required: true,
    },
    // Lista produselor vândute în cadrul comenzii
    products: [
      {
        // Referință la produsul vândut
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product", // Leagă acest câmp de modelul "Product"
          required: true,
        },
        // Cantitatea vândută a produsului
        quantity: { type: Number, required: true },
        // Prețul de vânzare la momentul comenzii
        unitPrice: { type: Number, required: true },
        // Unitatea de măsură pentru produs (ex.: "buc", "kg", "palet")
        unitMeasure: { type: String, required: true },
        // Prețul de intrare (achiziție) al produsului la momentul lansării comenzii, opțional
        entryPrice: { type: Number, default: null },
      },
    ],
    // Data și ora exactă a comenzii; implicit se setează data curentă
    orderDate: {
      type: Date,
      default: Date.now,
    },
    // Numărul unic al comenzii; formatul poate include un șablon specific, ex. "zz/ll/aa01"
    orderNumber: {
      type: String,
      required: true,
      unique: true, // Fiecare număr de comandă trebuie să fie unic
    },
    // Statusul comenzii, cu posibilități predefinite: "Lansata", "In pregatire", "Incarcata", "Confirmata", "Livrata"
    status: {
      type: String,
      default: "Lansata",
      enum: ["Lansata", "In pregatire", "Incarcata", "Confirmata", "Livrata"],
    },
    // Adresa de livrare a comenzii (opțional)
    deliveryAddress: {
      type: String,
      required: false,
    },
    // Data la care se așteaptă livrarea comenzii (poate fi setată sau modificată ulterior)
    deliveryDate: {
      type: Date,
      required: false,
    },
    // Comentarii suplimentare legate de comandă (opțional)
    comments: {
      type: String,
      required: false,
    },
    // Denormalizare: valoarea totală a comenzii pentru a evita calcule complexe la fiecare interogare
    totalValue: { type: Number, default: 0 },
    // Denormalizare: profitul total calculat pentru comandă
    totalProfit: { type: Number, default: 0 },
  },
  { timestamps: true } // Adaugă automat câmpurile "createdAt" și "updatedAt"
);

// Crearea indexurilor pentru a îmbunătăți performanța interogărilor:
// Index pe orderNumber pentru căutări rapide după numărul comenzii, asigurând unicitatea
orderSchema.index({ orderNumber: 1 }, { unique: true });
// Index pe client pentru a facilita căutările după client
orderSchema.index({ client: 1 });
// Index pe createdBy pentru căutări rapide după utilizatorul care a creat comanda
orderSchema.index({ createdBy: 1 });
// Index pe orderDate pentru a interoga rapid comenzile pe intervale de timp
orderSchema.index({ orderDate: 1 });
// Index pe status pentru filtrări rapide în funcție de starea comenzii
orderSchema.index({ status: 1 });
// Index pe deliveryDate pentru a facilita căutările pe baza datei de livrare
orderSchema.index({ deliveryDate: 1 });

// Crearea modelului "Order" folosind schema definită
const Order = mongoose.model("Order", orderSchema);

// Exportarea modelului pentru a putea fi utilizat în alte module ale aplicației
export default Order;
