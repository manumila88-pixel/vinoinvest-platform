# B2B/Enterprise Investigation — Results

## FASE 1: Come viene determinato B2B vs B2C

### Campo: `account_type` nella tabella `users` (Supabase)
- Default su signup: `"b2c"` (hardcoded in `AuthModal.jsx:31`)
- Tipi B2B riconosciuti: `["b2b", "wealth_manager", "cantina", "family_office"]`
- `"enterprise"` **NON è nella lista B2B** — non viene riconosciuto da nessuna logica

### Fonte del valore
```
App.jsx:468 → supabase.from("users").select("account_type").eq("id", session.user.id)
App.jsx:469 → const type = ud?.account_type || "b2c"
```

---

## FASE 1: Cosa cambia nell'interfaccia per B2B

### ✅ Cambia (poco):
1. **Market tab**: le API wines vengono chiamate con `?segment=b2b` → filtra vini con prezzo >€500, score >85, rischio basso/medio (`wineSegmentationService.js`)
2. **Market tab**: compare un bottone "Vista Istituzionale / Vista Completa" toggle (`App.jsx:1222`)
3. **Sidebar**: solo `account_type === "cantina"` vede il tab "B2B" nella navigazione (`App.jsx:1098`)

### ❌ Non cambia:
- La dashboard principale è identica
- Nessuna sezione/schermata dedicata B2B (solo il tab B2B per cantina)
- Nessun accento visivo che distingua la modalità
- Nessuna dashboard diversa per wealth_manager, b2b, family_office

---

## FASE 1: Il caso admin

**L'admin (manumila88@gmail.com) bypassa TUTTO:**
- Rilevato solo per email: `const isAdmin = userEmail === ADMIN_EMAIL` (`App.jsx:346`)
- Il badge account_type è NASCOSTO per admin: `{accountType && !isAdmin && (...)}` (`App.jsx:1013`)
- L'admin vede le stesse wine di un utente b2c (nessun segmento applicato, perché `isB2BUser` dipende da `accountType` che probabilmente è "b2c" nel DB)
- Se admin ha `account_type = "enterprise"` nel DB: "enterprise" non è in `["b2b", "wealth_manager", "cantina", "family_office"]`, quindi NESSUN filtro wines, NESSUN toggle istituzionale

**Risposta diretta:** L'admin non vede differenze perché: (1) il badge account_type è nascosto, (2) la logica B2B dipende dall'account_type che per admin è probabilmente "b2c", (3) "enterprise" non è un tipo B2B riconosciuto.

---

## FASE 3: Cosa MANCA perché Enterprise sia davvero diverso

1. **`"enterprise"` non è nella lista B2B** — va aggiunto a `["b2b", "wealth_manager", "cantina", "family_office", "enterprise"]` oppure trattato separatamente
2. **Nessuna dashboard Enterprise dedicata** — stesso layout di tutti
3. **Tab B2B visibile solo a `cantina`** — non a `b2b`, `wealth_manager`, `family_office`, `enterprise`
4. **Nessun filtro wines automatico per enterprise** — per ora solo segmento b2b (>€500, score >85)
5. **Nessuna feature esclusiva Enterprise** — accesso API, report avanzati, white-label, sono citati in email ma non implementati nell'UI
6. **Admin non vede le sue capabilities reali** — il badge account_type è nascosto per admin, quindi l'admin non sa in quale "modalità" è

---

## FASE 2: Fix implementato

- Admin: badge "ADMIN" (esistente) + nota "(vista completa)"
- B2B (b2b, wealth_manager, cantina, family_office): badge BLU "B2B" ben visibile
- Enterprise: badge VIOLA "ENTERPRISE" ben visibile
- B2C: nessun badge (modalità standard)
- Accento visivo: border-top colorato nella sidebar in base alla modalità
