import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

const API = import.meta.env.VITE_BACKEND_URL || "https://vinoinvest-backend-2.onrender.com";

export default function ReferralPage() {
  const [data, setData] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadData();
    loadLeaderboard();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) { setLoading(false); return; }
      const res = await fetch(`${API}/api/referral/my`, { headers: { Authorization: `Bearer ${session.access_token}` } });
      const d = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function loadLeaderboard() {
    try {
      const res = await fetch(`${API}/api/referral/leaderboard`);
      const d = await res.json();
      setLeaderboard(d.leaderboard || []);
    } catch (e) {}
  }

  function copyLink() {
    const link = data?.share_url || "";
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function shareOn(platform) {
    const url = data?.share_url || "";
    const text = "I'm investing in fine wine with AI on VinoInvest. Join me!";
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
    };
    window.open(urls[platform], "_blank", "width=600,height=400");
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--vi-bg)", color: "var(--vi-text)" }}>
      <style>{`
        .ref-stat { transition: transform var(--vi-dur) var(--vi-ease), box-shadow var(--vi-dur) var(--vi-ease); }
        .ref-stat:hover { transform: translateY(-2px); box-shadow: var(--vi-glow); }
        .ref-social-btn { transition: background var(--vi-dur-fast) linear; cursor: pointer; }
        .ref-social-btn:hover { opacity: 0.85; }
        .ref-leader-row { transition: background var(--vi-dur-fast) linear; border-radius: 8px; }
        .ref-leader-row:hover { background: var(--vi-bg-elev) !important; }
        @media (prefers-reduced-motion: reduce) { .ref-stat:hover { transform: none; } }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(24px,4vw,40px) 24px" }}>
        <a href="/" style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", textDecoration: "none" }}>← Back</a>

        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <div style={{
            width: 64, height: 64, margin: "0 auto 16px",
            background: "rgba(201,162,39,0.12)", border: "1px solid rgba(201,162,39,0.3)",
            borderRadius: "var(--vi-radius-full)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28
          }}>🤝</div>
          <h1 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-2xl)", fontWeight: 800, marginBottom: 12 }}>
            Referral Program
          </h1>
          <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-base)", maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Share VinoInvest with friends and fellow wine enthusiasts. Build your Ambassador status.
          </p>
        </div>

        {loading && (
          <div style={{ textAlign: "center", color: "var(--vi-text-dim)", padding: 40 }}>Loading...</div>
        )}

        {!loading && !data && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--vi-text-dim)" }}>
            <p>Please <a href="/" style={{ color: "var(--vi-accent)" }}>sign in</a> to access your referral code.</p>
          </div>
        )}

        {data && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 14, marginBottom: 32 }}>
              {[
                { label: "Your Code", value: data.code, accent: true },
                { label: "Times Shared", value: data.uses || 0 },
                { label: "Conversions", value: data.conversions || 0 },
              ].map(s => (
                <div key={s.label} className="ref-stat vi-card" style={{
                  border: s.accent ? "1px solid rgba(201,162,39,0.4)" : undefined,
                  padding: "18px 20px", textAlign: "center"
                }}>
                  <div style={{
                    fontSize: s.accent ? "var(--vi-fs-lg)" : "var(--vi-fs-xl)",
                    fontWeight: 800,
                    color: s.accent ? "var(--vi-accent)" : "var(--vi-text)",
                    fontFamily: s.accent ? "monospace" : undefined,
                    fontVariantNumeric: "tabular-nums"
                  }}>{s.value}</div>
                  <div style={{ fontSize: "var(--vi-fs-xs)", color: "var(--vi-text-dim)", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Share link */}
            <div className="vi-card" style={{
              border: "1px solid rgba(201,162,39,0.2)",
              padding: "clamp(18px,3vw,24px)", marginBottom: 24
            }}>
              <h3 style={{ fontSize: "var(--vi-fs-sm)", fontWeight: 600, marginBottom: 14 }}>Your Referral Link</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <input
                  readOnly
                  value={data.share_url || ""}
                  style={{
                    flex: 1, padding: "10px 14px",
                    background: "var(--vi-bg)", border: `1px solid var(--vi-border)`,
                    borderRadius: "var(--vi-radius-sm)", color: "var(--vi-text-dim)",
                    fontSize: "var(--vi-fs-sm)", minWidth: 200
                  }}
                />
                <button onClick={copyLink} className="vi-btn" style={{
                  background: copied ? "rgba(74,222,128,0.2)" : "var(--vi-accent)",
                  color: copied ? "var(--vi-positive)" : "var(--vi-bg)",
                  border: copied ? "1px solid rgba(74,222,128,0.4)" : "none",
                  padding: "10px 18px", whiteSpace: "nowrap"
                }}>
                  {copied ? "Copied" : "Copy Link"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { id: "twitter", label: "Share on X", bg: "#000" },
                  { id: "linkedin", label: "Share on LinkedIn", bg: "#0A66C2" },
                  { id: "whatsapp", label: "Share on WhatsApp", bg: "#25D366" },
                ].map(p => (
                  <button key={p.id} onClick={() => shareOn(p.id)} className="ref-social-btn" style={{
                    flex: 1, minWidth: 140, padding: "10px",
                    background: `${p.bg}22`, color: "var(--vi-text)",
                    border: `1px solid ${p.bg}44`,
                    borderRadius: "var(--vi-radius-sm)", fontWeight: 600,
                    fontSize: "var(--vi-fs-sm)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambassador badge */}
            {(data.conversions || 0) >= 3 && (
              <div style={{
                background: "rgba(201,162,39,0.08)",
                border: "1px solid rgba(201,162,39,0.3)",
                borderRadius: "var(--vi-radius-lg)", padding: 20, marginBottom: 24, textAlign: "center"
              }}>
                <div style={{
                  width: 48, height: 48, margin: "0 auto 8px",
                  background: "rgba(201,162,39,0.15)", borderRadius: "var(--vi-radius-full)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24
                }}>★</div>
                <h3 style={{ color: "var(--vi-accent)", fontSize: "var(--vi-fs-lg)", fontFamily: "var(--vi-font-display)", fontWeight: 700 }}>
                  Ambassador Status Unlocked
                </h3>
                <p style={{ color: "var(--vi-text-dim)", fontSize: "var(--vi-fs-sm)", marginTop: 6 }}>
                  You've referred {data.conversions} members to VinoInvest
                </p>
              </div>
            )}
          </>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div className="vi-card" style={{ padding: "clamp(18px,3vw,24px)" }}>
            <h3 style={{ fontFamily: "var(--vi-font-display)", fontSize: "var(--vi-fs-lg)", fontWeight: 700, marginBottom: 20 }}>
              Monthly Leaderboard
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {leaderboard.slice(0, 10).map((user, i) => (
                <div key={user.user_id || i} className="ref-leader-row" style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
                  background: i < 3 ? "rgba(201,162,39,0.06)" : "transparent",
                  border: i < 3 ? "1px solid rgba(201,162,39,0.12)" : "1px solid transparent"
                }}>
                  <span style={{
                    fontSize: "var(--vi-fs-sm)", width: 28, textAlign: "center",
                    fontWeight: 700, color: i < 3 ? "var(--vi-accent)" : "var(--vi-text-dim)"
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ flex: 1, fontFamily: "monospace", fontSize: "var(--vi-fs-sm)", color: "var(--vi-text-dim)" }}>
                    {user.code}
                  </span>
                  <span style={{ fontWeight: 700, color: i < 3 ? "var(--vi-accent)" : "var(--vi-text)", fontVariantNumeric: "tabular-nums" }}>
                    {user.conversions || user.uses || 0} referrals
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
