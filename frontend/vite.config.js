import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  ssr: {
    noExternal: ['react-icons'],
  },
  plugins: [react()],
  assetsInclude: ['**/*.topojson'],
});

/*
// https://vite.dev/config/
export default {
  build: {
    rollupOptions: {
      external: ["react-router-dom"],
    },
  },
};
*/