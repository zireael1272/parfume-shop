import express from "express";
import dotenv from "dotenv";
import stripe from "stripe";
import mongoose from "mongoose";
import Router from "./routes.js";

dotenv.config();
const PORT = process.env.PORT || 4000;
const Mongo = process.env.MONGO_URL;

const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use("/api", Router);

mongoose
  .connect(Mongo)
  .then(() => {
    console.log("DB is connection");
  })
  .catch((error) => console.error("DB connection error:", error));

app.get("/", (req, res) => {
  res.sendFile("main.html", { root: "public" });
});
app.get("/cart", (req, res) => {
  res.sendFile("cart.html", { root: "public" });
});

let stripeGateway = stripe(process.env.stripe_key);

app.post("/srtipe-checkout", async (req, res) => {
  const lineItems = req.body.items.map((item) => {
    const unitAmount = parseInt(parseFloat(item.price) * 100);

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    };
  });
  const session = await stripeGateway.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    success_url: `http://localhost:3000/success.html`,
    cancel_url: `http://localhost:3000/main.html`,
    line_items: lineItems,
    billing_address_collection: "required",
  });
  res.json({ url: session.url });
});

app.listen(PORT, () => {
  console.log("listing on port 3000");
});
