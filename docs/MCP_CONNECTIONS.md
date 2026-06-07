# VinoInvest — MCP Connections

> Model Context Protocol (MCP) server configurations for Claude Code.
> Aggiungi queste config in `~/.claude/claude_desktop_config.json` o `.claude/settings.json`.

## PostgreSQL (Render DB)

Permette a Claude di leggere e scrivere direttamente nel DB VinoInvest.

```bash
# Installa
npm install -g @modelcontextprotocol/server-postgres
```

Config da aggiungere in `.claude/settings.json`:

```json
{
  "mcpServers": {
    "vinoinvest-db": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-postgres",
        "${DATABASE_URL}"
      ],
      "env": {
        "DATABASE_URL": "postgresql://vinoinvest_user:PASSWORD@dpg-xxx.oregon-postgres.render.com/vinoinvest_db"
      }
    }
  }
}
```

**Capabilities:**
- `query` — esegui SELECT (read-only safe)
- `execute` — INSERT/UPDATE/DELETE (usa con cautela)
- `schema` — mostra struttura tabelle

**Tabelle disponibili:**
- `wines` — catalogo vini (id, name, producer, vintage, current_price, ...)
- `price_history` — storico prezzi (wine_id, price, recorded_at)
- `orders` — ordini utenti
- `price_cache` — cache prezzi aggregati

---

## Stripe MCP

Per gestire pagamenti, prodotti e abbonamenti direttamente da Claude.

```bash
# Installa
npm install -g @stripe/mcp
```

Config:

```json
{
  "mcpServers": {
    "stripe": {
      "command": "npx",
      "args": ["-y", "@stripe/mcp", "--tools=all"],
      "env": {
        "STRIPE_SECRET_KEY": "${STRIPE_SECRET_KEY}"
      }
    }
  }
}
```

**Capabilities:**
- Crea/aggiorna prodotti e prezzi
- Consulta abbonamenti attivi
- Verifica pagamenti e fatture
- Gestisci webhook

---

## Supabase MCP (opzionale)

Per gestire utenti, auth e storage Supabase.

```bash
npm install -g @supabase/mcp-server-supabase
```

Config:

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--project-id=xghuyfgftvrhnmuezbbz",
        "--read-only"
      ],
      "env": {
        "SUPABASE_SERVICE_ROLE_KEY": "${SUPABASE_SERVICE_ROLE_KEY}"
      }
    }
  }
}
```

**Nota:** usa `--read-only` in produzione per sicurezza.

---

## Configurazione completa `.claude/settings.json`

Merge con il settings.json esistente:

```json
{
  "mcpServers": {
    "vinoinvest-db": { ... },
    "stripe": { ... }
  }
}
```

---

## Test connessioni

```bash
# PostgreSQL
node -e "
  const { Client } = require('pg');
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  c.connect().then(() => c.query('SELECT COUNT(*) FROM wines')).then(r => console.log('Wines:', r.rows[0].count)).finally(() => c.end());
"

# Stripe
curl https://api.stripe.com/v1/products -u "$STRIPE_SECRET_KEY:" | jq '.data | length'
```
