import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("Aviso: STRIPE_SECRET_KEY não foi configurada no ambiente local.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_dummyKeyForBuild", {
  apiVersion: "2026-06-24.dahlia",
});
