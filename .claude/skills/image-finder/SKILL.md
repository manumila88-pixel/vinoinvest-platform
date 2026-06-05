# Skill: image-finder

Per ogni vino senza `imageUrl`, cerca un'immagine reale e aggiorna il DB o il file JSON.

## Trigger

Invoca quando:
- Un vino mostra l'emoji 🍷 invece di una bottiglia reale
- `wine.imageUrl` è null/undefined/stringa vuota
- L'utente chiede di migliorare le immagini del catalogo

## Strategia di ricerca immagini

### 1. Vivino CDN (priorità massima)
Pattern URL Vivino:
```
https://images.vivino.com/thumbs/{SLUG}_pb_x600.png
```
Dove `{SLUG}` è l'ID interno Vivino. Per trovarlo:
- Cerca il vino su `https://www.vivino.com/search/wines?q={nome+produttore}`
- Estrai lo slug dalla risposta HTML: `data-vintage-id`, `thumbs/{SLUG}`
- Verifica che l'immagine esista con `curl -I {url}` (deve restituire 200)

Esempio slug noti (da usare come template):
```
lafite-2018      → ApnIiXjcqWTX03ZD9dX9Lg_pb_x600.png  
mouton-2018      → GrGNKxjbJRnzVoEN5ZFmdQ_pb_x600.png
margaux-2015     → Q1Nu8x8-QbCMIhSQE3b6Pg_pb_x600.png
sassicaia-2016   → b-9f_aRQZZOHdVR56njhYg_pb_x600.png
```

### 2. Wine-Searcher fallback
```
https://media.wine-searcher.com/images/wines/large/{nome-kebab}.jpg
```

### 3. Immagini per tipo (ultimo fallback)
Se non si trova l'immagine specifica, usa immagini generiche per tipo:
```js
const FALLBACK_IMAGES = {
  rosso:     "https://images.vivino.com/thumbs/fallback-red.png",
  bianco:    "https://images.vivino.com/thumbs/fallback-white.png",
  rose:      "https://images.vivino.com/thumbs/fallback-rose.png",
  bollicine: "https://images.vivino.com/thumbs/fallback-sparkling.png",
};
```

## Procedura

```
1. Leggi src/data/wines.json, bigWines.json, externalWines.json
2. Filtra vini dove imageUrl è null/vuoto
3. Per ogni vino senza immagine:
   a. Costruisci URL Vivino con nome+produttore
   b. Verifica esistenza (curl -I)
   c. Se 200 → aggiorna imageUrl nel file JSON
   d. Se no → usa fallback per tipo
4. Aggiorna i file JSON
5. Opzionale: UPDATE wines SET image_url=$1 WHERE id=$2 nel DB
6. Testa che le immagini si carichino nella wine card
```

## Rilevamento tipo vino

```js
function detectType(wine) {
  const t = [wine.variety, wine.name, wine.region].join(" ").toLowerCase();
  if (t.match(/champagne|prosecco|cava|spumante|cremant|bollicine/)) return "bollicine";
  if (t.match(/ros[eé]/)) return "rose";
  if (t.match(/chardonnay|sauvignon|riesling|pinot grigio|bianco|blanc|white/)) return "bianco";
  return "rosso";
}
```

## Output

Alla fine: report con
- N vini aggiornati con immagine reale
- N vini con fallback per tipo
- N vini rimasti senza immagine (e perché)
