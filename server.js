import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Router from "./routes.js";
import path from "path";

dotenv.config();
const PORT = process.env.PORT || 3000;
const Mongo = process.env.MONGO_URL;

const app = express();
const __dirname = path.resolve();

app.use(express.static(__dirname));
app.use(express.json());
app.use("/api", Router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

mongoose
  .connect(Mongo)
  .then(() => {
    console.log("DB is connection");
  })
  .catch((error) => console.error("DB connection error:", error));

app.listen(PORT, () => {
  console.log("listing on port 3000");
});
