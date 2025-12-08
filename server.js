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

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use("/api", Router);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "pages", "index.html"));
});

app.get("/:page", (req, res) => {
  const page = req.params.page;

  if (page.includes(".")) {
    return res.status(404).send("File not found");
  }

  res.sendFile(path.join(__dirname, "public", "pages", `${page}.html`), (err) => {
    if (err) {
      console.log(`Error load: ${page}`);
      res.status(404).send("Page not found");
    }
  });
});

mongoose
  .connect(Mongo)
  .then(() => {
    console.log("DB is connection");
  })
  .catch((error) => console.error("DB connection error:", error));

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
