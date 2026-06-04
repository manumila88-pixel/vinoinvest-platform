-- Migration 001: price_cache e price_history
-- Eseguire una volta sul database di produzione
-- (il backend le crea automaticamente tramite priceService.js)

CREATE TABLE IF NOT EXISTS price_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id TEXT NOT NULL,
  wine_name TEXT NOT NULL,
  vintage INTEGER,
  price_min NUMERIC(10,2),
  price_max NUMERIC(10,2),
  price_avg NUMERIC(10,2),
  currency TEXT DEFAULT 'EUR',
  source TEXT DEFAULT 'wine-searcher',
  merchant_count INTEGER,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(wine_id, vintage)
);

CREATE TABLE IF NOT EXISTS price_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wine_id TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  source TEXT,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indici per query frequenti
CREATE INDEX IF NOT EXISTS idx_price_cache_wine_id ON price_cache(wine_id);
CREATE INDEX IF NOT EXISTS idx_price_cache_updated ON price_cache(last_updated);
CREATE INDEX IF NOT EXISTS idx_price_history_wine_id ON price_history(wine_id);
CREATE INDEX IF NOT EXISTS idx_price_history_recorded ON price_history(recorded_at);
