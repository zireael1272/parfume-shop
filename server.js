import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Router from "./routes.js";

dotenv.config();
const PORT = process.env.PORT || 3000;
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
  res.sendFile("index.html", { root: "public" });
});

app.listen(PORT, () => {
  console.log("listing on port 3000");
});
