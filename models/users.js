import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" },
  fullname: { type: String },
  phone: {
    type: String,
    unique: true,
    sparse: true,
  },
});

export default mongoose.model("User", userSchema);
