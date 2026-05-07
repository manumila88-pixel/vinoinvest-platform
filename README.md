# VinoInvest Platform Ready

Questa è una base pronta per trasformare la demo in una vera piattaforma.

Include:

- Frontend React + Vite
- Backend Node.js + Express
- Database demo in JSON
- Connettore Liv-ex predisposto
- Storico prezzi demo
- Motore stima crescita
- Ordini simulati
- Struttura per buy/sell tramite API partner ufficiali
- Variabili ambiente sicure

## Cosa funziona subito

Funziona subito in modalità demo con dati locali.

```bash
cd backend
npm install
npm run dev
```

Poi in un altro terminale:

```bash
cd frontend
npm install
npm run dev
```

Frontend:
http://localhost:5173

Backend:
http://localhost:3001

## Cosa serve per dati reali

Devi ottenere:

- LIVEX_API_KEY
- LIVEX_API_BASE_URL
- eventuali API partner per esecuzione ordini

Poi metti le chiavi nel file:

```bash
backend/.env
```

partendo da:

```bash
backend/.env.example
```

## Importante

Gli ordini reali sono disattivati per sicurezza.
Per abilitarli serve un partner ufficiale con API autorizzata.

