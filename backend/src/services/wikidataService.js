import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 7 * 24 * 60 * 60, useClones: false }); // 7 days

const SPARQL_ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT = "VinoInvest/1.0 (vinoinvest.com)";

function buildQuery(producerName) {
  const escaped = producerName.replace(/"/g, '\\"');
  return `
SELECT DISTINCT ?winery ?wineryLabel ?countryLabel ?inception ?description WHERE {
  ?winery wdt:P31 wd:Q156362 .
  ?winery rdfs:label ?label .
  FILTER(CONTAINS(LCASE(?label), LCASE("${escaped}")) && LANG(?label) = "en")
  OPTIONAL { ?winery wdt:P17 ?country }
  OPTIONAL { ?winery wdt:P571 ?inception }
  OPTIONAL { ?winery schema:description ?description . FILTER(LANG(?description) = "it" || LANG(?description) = "en") }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "it,en". }
} LIMIT 5
`.trim();
}

/**
 * Fetch producer info from Wikidata SPARQL endpoint.
 * @param {string} producerName
 * @returns {Promise<{name: string, country: string|null, foundingYear: number|null, description: string|null, notableWines: string[], awards: string[]}|null>}
 */
export async function getProducerFromWikidata(producerName) {
  if (!producerName || producerName.trim().length < 2) return null;

  const cacheKey = `wikidata_producer_${producerName.toLowerCase().trim()}`;
  const cached = cache.get(cacheKey);
  if (cached !== undefined) return cached;

  const query = buildQuery(producerName.trim());
  const url = `${SPARQL_ENDPOINT}?query=${encodeURIComponent(query)}&format=json`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/sparql-results+json",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) {
      console.warn(`[wikidataService] SPARQL ${res.status} for "${producerName}"`);
      cache.set(cacheKey, null);
      return null;
    }

    const data = await res.json();
    const bindings = data?.results?.bindings;

    if (!bindings || bindings.length === 0) {
      cache.set(cacheKey, null);
      return null;
    }

    // Use first result as primary
    const first = bindings[0];

    const name = first.wineryLabel?.value || producerName;
    const country = first.countryLabel?.value || null;

    let foundingYear = null;
    if (first.inception?.value) {
      const year = parseInt(first.inception.value.substring(0, 4), 10);
      if (!isNaN(year) && year > 1000 && year <= new Date().getFullYear()) {
        foundingYear = year;
      }
    }

    // Prefer Italian description, fall back to English
    let description = null;
    for (const binding of bindings) {
      if (binding.description?.value) {
        description = binding.description.value;
        break;
      }
    }

    const result = {
      name,
      country,
      foundingYear,
      description,
      notableWines: [],
      awards: [],
    };

    cache.set(cacheKey, result);
    return result;
  } catch (err) {
    console.warn(`[wikidataService] fetch error for "${producerName}":`, err.message);
    cache.set(cacheKey, null);
    return null;
  }
}
