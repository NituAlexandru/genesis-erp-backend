import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    carNumber: {
      type: String,
      required: true,
      unique: true,
    },
    carType: {
      type: String,
      required: false,
    },
    maxWeight: { type: Number, default: 0 },
    maxVolume: { type: Number, default: 0 },
    maxLoadWeight: { type: Number, default: 0 },
    maxLoadVolume: { type: Number, default: 0 },
    fuelType: { type: String, required: false },
    averageConsumption: { type: Number, default: 0 },
    fuelPrice: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    brand: { type: String, required: false },
    model: { type: String, required: false },
    chassisNumber: { type: String, required: false },
    notes: { type: String, required: false },

    // Obiect pentru capacități pe categorii de produse
    productCapacities: [
      {
        productCategory: { type: String, required: true },
        capacity: { type: Number, default: 0 },
      },
    ],

    // Obiect pentru restricții de trafic
    restrictions: {
      hasTrafficRestrictions: { type: Boolean, default: false },
      tonnageRestriction: { type: Number, default: 0 }, // tonaj maxim permis
      allowedHours: { type: String, default: "" }, // ex. "08:00-18:00"
      restrictedZones: [{ type: String }], // liste de zone interzise
      cityAccessPermission: { type: Boolean, default: true }, // permis intrare în oraș
    },

    // Timpuri estimative de încărcare pentru metode diferite
    loadingTimes: {
      manual: { type: Number, default: 0 }, // în minute pentru încărcare manuală
      crane: { type: Number, default: 0 }, // în minute pentru încărcare cu macara
      forklift: { type: Number, default: 0 }, // în minute pentru încărcare cu stivuitor
    },

    // Timpuri estimative de descărcare pentru metode diferite
    unloadingTimes: {
      manual: { type: Number, default: 0 }, // în minute pentru descărcare manuală
      crane: { type: Number, default: 0 }, // în minute pentru descărcare cu macara
      forklift: { type: Number, default: 0 }, // în minute pentru descărcare cu stivuitor
    },
  },
  { timestamps: true }
);

// Index principal: carNumber, indexuri adiționale pe brand și model
carSchema.index({ carNumber: 1 }, { unique: true });
carSchema.index({ brand: 1 });
carSchema.index({ model: 1 });

const Car = mongoose.model("Car", carSchema);

export default Car;
