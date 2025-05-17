import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    address: { type: String },
    phone: { type: String, required: true },
    opening_hours: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Restaurant", restaurantSchema);
