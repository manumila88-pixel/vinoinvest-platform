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
    <div style={{ minHeight: "100vh", background: "#020617", color: "#e2e8f0" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px" }}>
        <a href="/" style={{ color: "#64748b", fontSize: 13, textDecoration: "none" }}>← Back</a>

        <div style={{ textAlign: "center", margin: "40px 0" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>🤝</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, marginBottom: 12 }}>Referral Program</h1>
          <p style={{ color: "#94a3b8", fontSize: 16, maxWidth: 500, margin: "0 auto", lineHeight: 1.7 }}>
            Share VinoInvest with friends and fellow wine enthusiasts. Build your Ambassador status.
          </p>
        </div>

        {loading && <div style={{ textAlign: "center", color: "#64748b" }}>Loading...</div>}

        {!loading && !data && (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            <p>Please <a href="/" style={{ color: "#C9A227" }}>sign in</a> to access your referral code.</p>
          </div>
        )}

        {data && (
          <>
            {/* Stats */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 16, marginBottom: 32 }}>
              {[
                { label: "Your Code", value: data.code, gold: true },
                { label: "Times Shared", value: data.uses || 0 },
                { label: "Conversions", value: data.conversions || 0 },
              ].map(s => (
                <div key={s.label} style={{ background: "rgba(11,18,32,0.8)", border: `1px solid ${s.gold ? "rgba(201,162,39,0.4)" : "rgba(30,41,59,0.6)"}`, borderRadius: 12, padding: "18px 20px", textAlign: "center" }}>
                  <div style={{ fontSize: s.gold ? 20 : 28, fontWeight: 800, color: s.gold ? "#C9A227" : "#e2e8f0", fontFamily: s.gold ? "monospace" : "inherit" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Share link */}
            <div style={{ background: "rgba(11,18,32,0.85)", border: "1px solid rgba(201,162,39,0.2)", borderRadius: 16, padding: 24, marginBottom: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Your Referral Link</h3>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                <input
                  readOnly
                  value={data.share_url || ""}
                  style={{ flex: 1, padding: "10px 14px", background: "rgba(15,23,42,0.8)", border: "1px solid rgba(30,41,59,0.6)", borderRadius: 8, color: "#94a3b8", fontSize: 13, minWidth: 200 }}
                />
                <button onClick={copyLink} style={{
                  padding: "10px 18px", background: copied ? "rgba(74,222,128,0.2)" : "#C9A227",
                  color: copied ? "#4ade80" : "#020617", border: copied ? "1px solid rgba(74,222,128,0.4)" : "none",
                  borderRadius: 8, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap"
                }}>
                  {copied ? "✓ Copied!" : "Copy Link"}
                </button>
              </div>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { id: "twitter", label: "Share on X", bg: "#000", icon: "𝕏" },
                  { id: "linkedin", label: "Share on LinkedIn", bg: "#0A66C2", icon: "in" },
                  { id: "whatsapp", label: "Share on WhatsApp", bg: "#25D366", icon: "💬" },
                ].map(p => (
                  <button key={p.id} onClick={() => shareOn(p.id)} style={{
                    flex: 1, minWidth: 140, padding: "10px", background: `${p.bg}22`, color: "#e2e8f0",
                    border: `1px solid ${p.bg}44`, borderRadius: 8, cursor: "pointer", fontWeight: 600, fontSize: 13,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                  }}>
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ambassador badge */}
            {(data.conversions || 0) >= 3 && (
              <div style={{ background: "rgba(201,162,39,0.08)", border: "1px solid rgba(201,162,39,0.3)", borderRadius: 16, padding: 20, marginBottom: 24, textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏅</div>
                <h3 style={{ color: "#C9A227", fontSize: 18, fontFamily: "'Playfair Display', serif" }}>Ambassador Status Unlocked</h3>
                <p style={{ color: "#94a3b8", fontSize: 13, marginTop: 6 }}>You've referred {data.conversions} members to VinoInvest</p>
              </div>
            )}
          </>
        )}

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div style={{ background: "rgba(11,18,32,0.8)", border: "1px solid rgba(30,41,59,0.5)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 20 }}>🏆 Monthly Leaderboard</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {leaderboard.slice(0, 10).map((user, i) => (
                <div key={user.user_id || i} style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  background: i < 3 ? "rgba(201,162,39,0.06)" : "transparent",
                  borderRadius: 8, border: i < 3 ? "1px solid rgba(201,162,39,0.15)" : "1px solid transparent"
                }}>
                  <span style={{ fontSize: 18, width: 28, textAlign: "center" }}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `${i + 1}`}
                  </span>
                  <span style={{ flex: 1, fontFamily: "monospace", fontSize: 13, color: "#64748b" }}>
                    {user.code}
                  </span>
                  <span style={{ fontWeight: 700, color: i < 3 ? "#C9A227" : "#e2e8f0" }}>
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
