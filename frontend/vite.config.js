import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Recharts — big charting library into its own chunk
          if (id.includes('recharts') || id.includes('d3-')) return 'ComposedChart';
          // React core
          if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
          // i18n
          if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n';
          // Academy content (largest lazy chunk)
          if (id.includes('/pages/Academy') || id.includes('academyContent')) return 'academy';
          // B2B & Dashboard
          if (id.includes('/pages/B2B') || id.includes('/pages/Dashboard')) return 'b2b';
          // Legal & misc pages
          if (id.includes('/pages/Terms') || id.includes('/pages/PrivacyPolicy') ||
              id.includes('/pages/Cookies') || id.includes('/pages/Disclaimer') ||
              id.includes('/pages/Pricing')) return 'legal-pages';
          // Market tools
          if (id.includes('/pages/MarketIndex') || id.includes('/pages/MarketSentiment') ||
              id.includes('/pages/EnPrimeur') || id.includes('/pages/AuctionTracker')) return 'market-tools';
        }
      }
    }
  }
})
