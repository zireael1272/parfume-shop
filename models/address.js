import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },

  city: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  apartment: { type: String },
});

export default mongoose.model("Address", addressSchema);
