/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react';
import { defineConfig, type UserConfig } from 'vite';

const config: UserConfig & {
  test: {
    environment: string;
    setupFiles: string;
    globals: boolean;
  };
} = {
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    globals: true
  }
};

export default defineConfig(config);
