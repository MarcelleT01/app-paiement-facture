import express from "express";
import Payment from "../models/Payment.js";

const router = express.Router();

// 🔹 Créer un paiement
router.post("/", async (req, res) => {
  try {
    const { name, phone, amount } = req.body;
    const payment = new Payment({ name, phone, amount, status: "success" });
    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 🔹 Récupérer l’historique des paiements
router.get("/", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
