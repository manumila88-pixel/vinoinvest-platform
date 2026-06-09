import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGS } from "../i18n";

const FLAG_MAP = {
  it: "🇮🇹", en: "🇬🇧", fr: "🇫🇷", de: "🇩🇪", es: "🇪🇸", pt: "🇵🇹",
  zh: "🇨🇳", ja: "🇯🇵", ko: "🇰🇷", ar: "🇸🇦", ru: "🇷🇺", nl: "🇳🇱",
  sv: "🇸🇪", no: "🇳🇴", da: "🇩🇰", fi: "🇫🇮", pl: "🇵🇱", cs: "🇨🇿",
  hu: "🇭🇺", ro: "🇷🇴", el: "🇬🇷", tr: "🇹🇷", he: "🇮🇱", hi: "🇮🇳",
  th: "🇹🇭", vi: "🇻🇳", id: "🇮🇩", ms: "🇲🇾", uk: "🇺🇦", ca: "🏴",
  sk: "🇸🇰", bg: "🇧🇬", hr: "🇭🇷", sl: "🇸🇮", et: "🇪🇪", lv: "🇱🇻",
  lt: "🇱🇹", sr: "🇷🇸", mk: "🇲🇰", sq: "🇦🇱",
};

const NAME_MAP = {
  it: "Italiano", en: "English", fr: "Français", de: "Deutsch", es: "Español",
  pt: "Português", zh: "中文", ja: "日本語", ko: "한국어", ar: "العربية",
  ru: "Русский", nl: "Nederlands", sv: "Svenska", no: "Norsk", da: "Dansk",
  fi: "Suomi", pl: "Polski", cs: "Čeština", hu: "Magyar", ro: "Română",
  el: "Ελληνικά", tr: "Türkçe", he: "עברית", hi: "हिन्दी", th: "ไทย",
  vi: "Tiếng Việt", id: "Bahasa Indonesia", ms: "Melayu", uk: "Українська",
  ca: "Català", sk: "Slovenčina", bg: "Български", hr: "Hrvatski",
  sl: "Slovenščina", et: "Eesti", lv: "Latviešu", lt: "Lietuvių",
  sr: "Српски", mk: "Македонski", sq: "Shqip",
};

export default function LangSelector() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current = i18n.language?.slice(0, 2) || "en";

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          padding: "5px 10px",
          border: "1px solid var(--vi-border)",
          borderRadius: "var(--vi-radius-sm)",
          background: "transparent",
          color: "#4a6a8a",
          fontSize: 13,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 5,
          fontFamily: "var(--vi-font-sans)",
        }}
        aria-label="Language"
      >
        {FLAG_MAP[current] || "🌐"} <span style={{ fontSize: 10 }}>▾</span>
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 6px)",
          right: 0,
          background: "var(--vi-bg)",
          border: "1px solid var(--vi-accent-glow)",
          borderRadius: "var(--vi-radius-md)",
          overflow: "hidden auto",
          maxHeight: 320,
          width: 180,
          zIndex: 500,
          boxShadow: "0 16px 48px rgba(0,0,0,0.7)",
        }}>
          {SUPPORTED_LANGS.map(lang => (
            <button
              key={lang}
              onClick={() => { i18n.changeLanguage(lang); setOpen(false); }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                width: "100%",
                padding: "8px 14px",
                border: "none",
                background: current === lang ? "rgba(201,162,39,0.1)" : "transparent",
                color: current === lang ? "var(--vi-accent)" : "var(--vi-text-dim)",
                fontSize: 12,
                cursor: "pointer",
                textAlign: "left",
                fontFamily: "var(--vi-font-sans)",
                fontWeight: current === lang ? 700 : 400,
              }}
            >
              <span>{FLAG_MAP[lang] || "🌐"}</span>
              <span>{NAME_MAP[lang] || lang.toUpperCase()}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
