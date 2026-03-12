import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envDir: '../',
  preview: {
    allowedHosts: [
      'kortex-frontend-1075947428559.us-east4.run.app'
    ]
  }
})