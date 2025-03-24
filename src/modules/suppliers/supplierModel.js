import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    // Cod fiscal, cont bancar
    fiscalCode: { type: String, required: false },
    bankAccount: { type: String, required: false },
    // Transport extern: dacă este adevărat, se va folosi un sofer furnizat de furnizor
    externalTransport: { type: Boolean, default: false },
    // Costuri de transport generale (poate fi folosit pentru costuri interne sau externe, după necesitate)
    transportCosts: { type: Number, default: 0 },

    // Adresa de ridicare/incarcare a mărfii
    loadingAddress: { type: String, required: false },
    // Catalogul de produse al furnizorului – referințe către produsele din colecția "Product"
    productCatalog: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    // Informații despre soferul furnizorului, dacă se folosește transport extern
    supplierDriver: { type: String, required: false },
    // Costuri de transport externe – dacă se calculează separat
    externalTransportCosts: { type: Number, default: 0 },
    // Costuri de transport interne – generate de drum, de exemplu
    internalTransportCosts: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Index pe câmpul name pentru interogări rapide
supplierSchema.index({ name: 1 });

const Supplier = mongoose.model("Supplier", supplierSchema);

export default Supplier;
