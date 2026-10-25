/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    base: 'https://chazmcgrill.github.io/bugsweeper/',
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
