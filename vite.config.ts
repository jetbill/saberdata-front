import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // El backend solo permite CORS desde http://localhost:5173 (CORS_ALLOWED_ORIGINS):
    // si el puerto está ocupado, falla en vez de cambiar a otro y romper las peticiones.
    port: 5173,
    strictPort: true,
  },
})
