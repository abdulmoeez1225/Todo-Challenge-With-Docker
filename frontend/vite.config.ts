import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api/users': 'http://localhost:3001',
      '/api/todos': 'http://localhost:3002'
    }
  }
})
