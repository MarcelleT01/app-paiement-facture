import express from "express";
import axios from "axios";
import Payment from "../models/Payment.js";

const router = express.Router();

router.post("/pay", async (req, res) => {
  const { name, phone, amount, description } = req.body;
  if (!name || !phone || !amount) return res.status(400).json({ error: "Champs manquants" });

  try {
    const payment = await Payment.create({
      name, phone, amount, description: description || "Paiement facture", status: "pending"
    });

    if (process.env.MOCK === "true") {
      payment.status = "success";
      payment.response = { mock: true, message: "Paiement simulé (MOCK)" };
      await payment.save();
      return res.json({ success: true, payment });
    }

    const authRes = await axios.post("https://demo.campay.net/api/token/", {
      username: process.env.CAMPAY_USERNAME,
      password: process.env.CAMPAY_PASSWORD
    });

    const token = authRes.data?.token;
    if (!token) {
      payment.status = "failed";
      payment.response = { auth: authRes.data };
      await payment.save();
      return res.status(500).json({ error: "Authentification Campay échouée" });
    }

    const collectRes = await axios.post(
      "https://demo.campay.net/api/collect/",
      {
        amount,
        from: phone,
        description: description || `Paiement facture - ${name}`,
        currency: "XAF"
      },
      { headers: { Authorization: `Token ${token}` } }
    );

    payment.status = "success";
    payment.response = collectRes.data;
    await payment.save();

    return res.json({ success: true, payment, collectData: collectRes.data });
  } catch (err) {
    console.error("Erreur /pay:", err?.response?.data || err.message || err);
    try {
      await Payment.create({
        name, phone, amount, description: description || "Paiement facture", status: "failed",
        response: err?.response?.data || err.message
      });
    } catch (saveErr) {
      console.error("Erreur sauvegarde échec:", saveErr);
    }
    return res.status(500).json({ error: "Paiement échoué", details: err?.response?.data || err.message });
  }
});

router.get("/payments", async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).limit(500);
    res.json(payments);
  } catch (err) {
    console.error("GET /payments err:", err);
    res.status(500).json({ error: "Impossible de récupérer les paiements" });
  }
});

export default router;
