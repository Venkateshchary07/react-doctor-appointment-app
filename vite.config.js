import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Use relative base path when building
    base: command === 'build' ? './' : '/',
    build: {
      outDir: 'dist',
      emptyOutDir: true,
    },
  };
});
