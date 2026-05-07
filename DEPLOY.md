# Deploy online

## Opzione semplice

Frontend su Vercel.
Backend su Render o Railway.
Database su Supabase.

## 1. Backend

Carica la cartella backend su GitHub.

Su Render/Railway:

- Build command: npm install
- Start command: npm start
- Env vars:
  - PORT
  - LIVEX_API_KEY
  - LIVEX_API_BASE_URL
  - OPENAI_API_KEY o ANTHROPIC_API_KEY
  - ENABLE_REAL_ORDERS=false

Quando è online, prendi URL backend:
https://tuo-backend.onrender.com

## 2. Frontend

Carica la cartella frontend su GitHub.

Su Vercel:

- Framework: Vite
- Build command: npm run build
- Output: dist
- Env var:
  - VITE_API_URL=https://tuo-backend.onrender.com

## 3. Database

Per ora i dati sono JSON locali.

Per produzione usa Supabase PostgreSQL con tabelle:

- users
- wines
- price_history
- portfolios
- orders
- partners
- api_logs

## 4. Ordini reali

Lascia:

ENABLE_REAL_ORDERS=false

Finché non hai un contratto API ufficiale.

