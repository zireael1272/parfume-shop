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

router.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    const address = await Address.findOne({ userId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      user,
      address: address || {},
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { fullname, phone, city, street, house, apartment } = req.body;

    await User.findByIdAndUpdate(userId, { fullname, phone });

    await Address.findOneAndUpdate(
      { userId: userId },
      {
        userId: userId,
        city,
        street,
        house,
        apartment,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({ message: "Data updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating data", error: err.message });
  }
});

router.post("/productAdd", async (req, res) => {
  try {
    const { title, category, price, image, stock } = req.body;

    const newProduct = new Product({
      title,
      category,
      price,
      image,
      stock,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully" });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
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
    const { userId, address, listItems, sum } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is missing" });
    }

    let addressString = "";

    if (typeof address === "object") {
      const city = address.city || "";
      const street = address.street || "";
      const house = address.house || "";
      const apt = address.apartment ? `, apt. ${address.apartment}` : "";

      addressString = `${city}, ${street}, ${house}${apt}`;
    } else {
      addressString = String(address);
    }

    let delivery = await DeliveryMethod.findOne({ type: "Courier" });

    const newOrder = new Order({
      userId: userId,
      listItems: listItems.map((item) => ({
        productId: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      })),
      sum: sum,
      address: addressString,

      deliveryMethodId: delivery._id,
      status: "Paid",
    });

    await newOrder.save();

    res
      .status(201)
      .json({ message: "Order created successfully", orderId: newOrder._id });
  } catch (err) {
    console.error("Order Save Error:", err);
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
});

export default router;
