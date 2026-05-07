import dotenv from "dotenv";
dotenv.config();

/**
 * Motore ordini.
 *
 * Ora è sicuro: crea solo ordini simulati.
 * Per ordini reali serve API ufficiale del partner.
 */
export async function placeOrder({ side, wineId, quantity, maxPrice }) {
  const realOrdersEnabled = process.env.ENABLE_REAL_ORDERS === "true";

  if (!realOrdersEnabled) {
    return {
      mode: "simulation",
      status: "created",
      side,
      wineId,
      quantity,
      maxPrice,
      message: "Ordine simulato creato. Gli ordini reali sono disattivati."
    };
  }

  // Qui si collega il partner ufficiale.
  // Esempio: await partnerApi.createOrder(...)
  throw new Error("Ordini reali non configurati. Serve API partner ufficiale.");
}
