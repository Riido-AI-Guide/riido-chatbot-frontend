import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // VITE_API_BASE_URL=/api 로 두면 백엔드 호출이 같은 출처(5173)로 나가서 CORS/샌드박스 문제를 피한다.
      // 백엔드 경로는 루트(/users, /conversations …)라 /api 접두사를 떼서 넘긴다.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
