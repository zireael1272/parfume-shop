import mongoose from "mongoose";

const deliveryMethodSchema = new mongoose.Schema({
  type: { type: String, enum: ["Courier", "Pickup", "Post Office"] },
  estimatedDays: { type: Number },
});

export default mongoose.model("DeliveryMethod", deliveryMethodSchema);
