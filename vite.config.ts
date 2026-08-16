import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.png'],
      manifest: {
        name: 'Class Chat',
        short_name: 'ClassChat',
        description: 'Chat with your class',
        theme_color: '#25D366',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'icon.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
