import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Aviso: STRIPE_SECRET_KEY não foi configurada no ambiente local.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-02-24.acacia", // Versao moderna recomendada
});
