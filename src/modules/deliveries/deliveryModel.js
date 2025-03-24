import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    // Care vânzare (comandă) se livrează
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Soferul care livrează
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // dacă e sofer extern, se va scris 'sofer extern' cu loc de a trece numele/nr. masina
    },
    // Date despre mașina care livrează - nr masina si tipul/categoria/tonaj - referinta la masina din db?
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: false,
    },
    carNumber: {
      type: String,
      required: false,
    },
    // Data livrării
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      default: "In curs",
      enum: ["In curs", "Livrata", "Anulata", "Confirmata"],
    },
    // Ex.: locatii multiple, date de contact, etc.
    notes: {
      type: String,
      required: false,
    },
    // Alte câmpuri: status (Lansata, In pregatire, Incarcata, Confirmata, Livrata), data livrare etc.
    // locatie livrare
    // client livrare - o referinta catre client cu toate datele lui
    // ca sa fie preluate
    // trebuie sa permita si sa se faca mai multe livrari din o comanda
    // trebuie sa permita si sa se faca o livrare din mai multe comenzi
  },
  { timestamps: true }
);

// Indexuri
deliverySchema.index({ driver: 1 });
deliverySchema.index({ car: 1 });
// Căutări după data livrării
deliverySchema.index({ deliveryDate: 1 });
// Dacă faci des query după orders, poți indexa
// deliverySchema.index({ orders: 1 });

const Delivery = mongoose.model("Delivery", deliverySchema);

export default Delivery;
