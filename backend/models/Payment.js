import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  amount: { type: Number, required: true },
  description: { type: String, default: "Paiement facture" },
  status: { type: String, enum: ["pending","success","failed"], default: "pending" },
  response: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Payment", paymentSchema);
