# Wine Journal — Analisi e Stato Fix

## Cosa ho trovato

### Struttura
- Componente: `frontend/src/pages/WineJournal.jsx`
- Backend route: `backend/src/routes/journal.js` (montata su `/api/journal`)
- DB: tabella `journal_entries` creata automaticamente all'avvio in `server.js:469`
- Pool DB: passato correttamente via `setJournalPool(pool)` in `server.js:622`

### Perché le categorie appaiono vuote
Le "categorie" (Cena, Celebrazione, Degustazione...) sono **filtri per occasione** applicati sulle note inserite dall'utente — NON canali pre-popolati. Appaiono vuote perché nessun utente ha ancora aggiunto note con quelle occasioni. Il comportamento è corretto.

### Form di inserimento
Il form funziona correttamente a livello di codice:
- POST `/api/journal` con token Bearer (Supabase session)
- INSERT in DB con tutti i campi
- Reload automatico dopo salvataggio

### Cosa era rotto
1. **Tutte le stringhe erano in inglese** — titolo, bottoni, filtri, placeholder, etichette form
2. Nessun messaggio visibile se l'utente non è autenticato (la lista restava vuota senza spiegazione)

## Fix applicati

1. Tradotto tutto in italiano:
   - OCCASIONS: Cena, Celebrazione, Degustazione, Regalo, Business, Casual, Club del vino, Altro
   - UI: "Diario del Vino", "+ Aggiungi Nota", "Tutte", "Caricamento...", "Nessuna nota di degustazione"
   - Form: "Nome del Vino", "Annata", "Data di Degustazione", "Con Chi", "Valutazione", "Occasione", "Note di Degustazione"
   - Bottoni: "Annulla", "Salva Nota"

## Prossimi passi opzionali
- Aggiungere messaggio "Accedi per usare il Diario" quando `!token`
- Aggiungere ricerca/filtro per nome vino
