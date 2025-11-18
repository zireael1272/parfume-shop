import mongoose from "mongoose";

const deliveryMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["Courier", "Pickup", "Warehouse"] },
  estimatedDays: { type: Number },
});

export default mongoose.model("DeliveryMethod", deliveryMethodSchema);
