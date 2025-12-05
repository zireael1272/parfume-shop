import express from "express";
const router = express.Router();
import User from "./models/users.js";
import Address from "./models/address.js";
import Product from "./models/product.js";
import DeliveryMethod from "./models/deliveryMethod.js";
import Order from "./models/order.js";
import bcrypt from "bcrypt";

router.post("/register", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid password" });

    res.json({
      message: "Login successful",
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/products", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/order", async (req, res) => {
  try {
    const { userId, listItems, sum, address, deliveryMethodId } = req.body;

    if (!userId || !listItems || !sum || !address) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // 1) Создаём адрес
    const newAddress = new Address({
      userId,
      ...address,
    });
    await newAddress.save();

    // 2) Создаём заказ
    const newOrder = new Order({
      userId,
      listItems,
      sum,
      addressId: newAddress._id,
      deliveryMethodId, // пока пусть фронт передаёт null
      status: "Paid",
    });

    await newOrder.save();

    res.status(201).json({ message: "Order saved", orderId: newOrder._id });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
