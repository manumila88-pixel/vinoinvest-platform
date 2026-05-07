import dotenv from "dotenv";
dotenv.config();

/**
 * Connettore predisposto per Liv-ex.
 *
 * In produzione:
 * - chiedi accesso API a Liv-ex
 * - inserisci LIVEX_API_KEY e LIVEX_API_BASE_URL in .env
 * - adatta endpoint e auth header secondo il contratto ricevuto
 */
export async function getLivexMarketData(lwin) {
  const apiKey = process.env.LIVEX_API_KEY;
  const baseUrl = process.env.LIVEX_API_BASE_URL;

  if (!apiKey || !baseUrl) {
    return {
      source: "demo",
      message: "Liv-ex API non configurata. Uso dati demo.",
      lwin
    };
  }

  // Esempio intenzionale. L'endpoint reale dipende dal contratto API Liv-ex.
  const url = `${baseUrl}/market-price?lwin=${encodeURIComponent(lwin)}`;

  const response = await fetch(url, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Errore Liv-ex API: ${response.status}`);
  }

  return await response.json();
}
