import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://51.20.198.242:8000', // Update this if your API runs on a different URL in production
        secure: false,
      }  

    },
  },
  plugins: [react()],
});
