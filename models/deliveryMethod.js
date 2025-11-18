import mongoose from "mongoose";

const deliveryMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["Courier", "Pickup", "Warehouse"] },
  price: { type: Number, required: true },
  estimatedDays: { type: Number },
});

export default mongoose.model("DeliveryMethod", deliveryMethodSchema);
