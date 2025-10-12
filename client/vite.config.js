import { defineConfig } from 'vite';

export default defineConfig({
  root: '.', // client 폴더가 루트
  publicDir: 'assets', // assets 폴더를 public으로 사용
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    emptyOutDir: true
  }
});
