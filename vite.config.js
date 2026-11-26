import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Adresse publique du site, fournie automatiquement par Netlify (URL)
// ou Vercel (VERCEL_PROJECT_PRODUCTION_URL). Sert à l'image d'aperçu de partage.
function siteUrl() {
  if (process.env.SITE_URL) return process.env.SITE_URL
  if (process.env.URL) return process.env.URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  return ''
}

function socialMeta() {
  return {
    name: 'social-meta',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl().replace(/\/$/, '')),
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), socialMeta()],
  // Le moteur PDF (chargé à la demande) dépasse 500 ko : c'est attendu
  build: { chunkSizeWarningLimit: 1500 },
})
