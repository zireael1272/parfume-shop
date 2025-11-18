import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, enum: ["Woman", "Man", "Unisex"], required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  stock: { type: Number, default: 0 },
});

export default mongoose.model("Product", productSchema);
