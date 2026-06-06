let pool = null;
let tableReady = false;

export function setTranslationPool(p) { pool = p; }

async function ensureTable() {
  if (!pool || tableReady) return;
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS translations (
        hash_key TEXT NOT NULL,
        lang TEXT NOT NULL,
        original TEXT NOT NULL,
        translated TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        PRIMARY KEY (hash_key, lang)
      )
    `);
    tableReady = true;
  } catch (_) {}
}

function hashText(text) {
  let h = 5381;
  for (let i = 0; i < text.length; i++) {
    h = ((h << 5) + h) ^ text.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36);
}

async function getCache(key, lang) {
  if (!pool) return null;
  try {
    const { rows } = await pool.query(
      `SELECT translated FROM translations WHERE hash_key = $1 AND lang = $2`,
      [key, lang]
    );
    return rows[0]?.translated || null;
  } catch { return null; }
}

async function setCache(key, lang, original, translated) {
  if (!pool) return;
  try {
    await pool.query(
      `INSERT INTO translations (hash_key, lang, original, translated)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (hash_key, lang) DO UPDATE SET translated = EXCLUDED.translated, created_at = NOW()`,
      [key, lang, original, translated]
    );
  } catch (_) {}
}

async function callMyMemory(text, fromLang, toLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}&de=contact@vinoinvest.com`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated || translated === text) throw new Error("No translation returned");
  return translated;
}

// Translate a single text string
export async function translateText(text, targetLang, sourceLang = "it") {
  if (!text?.trim()) return text;
  if (targetLang === sourceLang || targetLang === "it" && sourceLang === "it") return text;

  // Normalize lang codes (e.g. en-US → en)
  const from = sourceLang.slice(0, 2);
  const to = targetLang.slice(0, 2);
  if (from === to) return text;

  await ensureTable();

  const key = hashText(text + "|" + from);
  const cached = await getCache(key, to);
  if (cached) return cached;

  // Split text into chunks of max 450 chars at sentence boundaries
  const chunks = splitText(text, 450);
  const translatedChunks = [];

  for (const chunk of chunks) {
    try {
      const t = await callMyMemory(chunk, from, to);
      translatedChunks.push(t);
    } catch {
      translatedChunks.push(chunk); // fallback: keep original
    }
  }

  const result = translatedChunks.join(" ");
  await setCache(key, to, text, result);
  return result;
}

function splitText(text, maxLen) {
  if (text.length <= maxLen) return [text];
  const chunks = [];
  let current = "";
  const sentences = text.split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    if ((current + sentence).length > maxLen) {
      if (current) { chunks.push(current.trim()); current = ""; }
      // sentence itself is longer than maxLen — hard split
      if (sentence.length > maxLen) {
        for (let i = 0; i < sentence.length; i += maxLen) {
          chunks.push(sentence.slice(i, i + maxLen));
        }
      } else {
        current = sentence;
      }
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

// Translate an array of objects — only translates specified string fields
export async function translateObjects(items, fields, targetLang, sourceLang = "it") {
  if (!items?.length) return items;
  const to = targetLang?.slice(0, 2);
  const from = sourceLang?.slice(0, 2);
  if (!to || to === from) return items;

  return Promise.all(items.map(async item => {
    const clone = { ...item };
    for (const field of fields) {
      if (clone[field]) {
        clone[field] = await translateText(clone[field], to, from);
      }
    }
    return clone;
  }));
}
