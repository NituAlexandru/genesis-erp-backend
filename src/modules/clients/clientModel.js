import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    cnp: {
      type: String,
      required: false,
    },
    cui: {
      type: String,
      required: false,
    },
    nrRegComert: {
      type: String,
      required: false,
    },
    clientType: {
      type: String, // "fizica" sau "juridica"
      required: true,
      enum: ["persoana fizica", "persoana juridica"],
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
    iban: {
      type: String,
      required: false,
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
    invoices: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
    avizes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Aviz",
      },
    ],
    deliveries: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Delivery",
      },
    ],
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);

export default Client;
