import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import paymentsRouter from "./routes/payments.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// connexion mongodb
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/campay_app";
mongoose.connect(mongoUri)
  .then(() => console.log(" MongoDB connecté"))
  .catch(err => console.error("Erreur MongoDB:", err.message));

app.use("/api", paymentsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Backend sur http://localhost:${PORT}`));
