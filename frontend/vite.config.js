import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Inline assets smaller than 8 kB as base64 data URIs — reduces HTTP requests
    // for small icons and SVGs. Default is 4 kB; 8 kB is safe for modern browsers.
    assetsInlineLimit: 8192,
    // B2B premium content chunks are lazy-loaded (B2B professional users only) — 750 kB is safe
    chunkSizeWarningLimit: 750,
    // Rolldown-native chunking (Vite 8). Replaces rollupOptions.manualChunks.
    // Groups with higher priority win when a module matches multiple rules.
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            // ── Vendors ──────────────────────────────────────────────────────
            { name: 'recharts', test: /node_modules\/(recharts|d3-)/, priority: 200 },
            { name: 'react-vendor', test: /node_modules\/(react-dom|react-router)/, priority: 200 },
            { name: 'supabase', test: /node_modules\/@supabase/, priority: 180 },
            { name: 'i18n', test: /node_modules\/(i18next|react-i18next)/, priority: 180 },

            // ── Heavy data files (change less than UI → better cache reuse) ──
            { name: 'academy-data', test: /\/data\/academyContent/, priority: 120 },
            { name: 'academy-premium-data', test: /\/data\/premiumContent/, priority: 120 },
            { name: 'academy-premium-consumer', test: /\/data\/premiumModulesConsumer/, priority: 115 },
            { name: 'academy-premium-b2b-a', test: /\/data\/premiumModulesB2B\.js/, priority: 116 },
            { name: 'academy-premium-b2b-b', test: /\/data\/premiumModulesB2B_b/, priority: 115 },
            { name: 'faq-data', test: /\/data\/faq/, priority: 110 },

            // ── Feature chunks ────────────────────────────────────────────────
            { name: 'academy-modules', test: /\/pages\/AcademyModule|\/pages\/AcademyTemplates/, priority: 90 },
            { name: 'academy', test: /\/pages\/Academy/, priority: 80 },
            { name: 'b2b', test: /\/pages\/(B2B|Dashboard|OrgDashboard|ClientDetail|B2BOnboarding)/, priority: 70 },
            { name: 'legal-pages', test: /\/pages\/(Terms|PrivacyPolicy|Cookies|Disclaimer|Pricing)/, priority: 60 },
            { name: 'market-tools', test: /\/pages\/(MarketIndex|MarketSentiment|EnPrimeur|AuctionTracker)/, priority: 60 },
          ],
        },
      },
    },
  }
})
