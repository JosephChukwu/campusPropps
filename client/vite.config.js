import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
    '/api': {
      target: 'http://localhost:8000',
      secure: false,
    }
  },},

  base: "/CampusPropsx/",
  plugins: [react()],
})
