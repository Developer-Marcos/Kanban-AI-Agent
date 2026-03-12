import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  //envDir: '../', //Ative se for rodar localmente - Active if running localy
  preview: {
    allowedHosts: [
      'kortex-frontend-1075947428559.us-east4.run.app'
    ]
  }
})