import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default {
  build: {
    rollupOptions: {
      external: ["react-router-dom"],
    },
  },
};