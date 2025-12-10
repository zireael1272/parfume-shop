import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  listItems: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
      image: { type: String, required: true },
    },
  ],

  sum: { type: Number, required: true },

  address: {
    type: String,
    required: true,
  },

  deliveryMethodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DeliveryMethod",
    required: true,
  },

  status: {
    type: String,
    enum: ["Paid", "In progress", "In transit", "Delivered", "Cancelled"],
    default: "Paid",
  },

  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
