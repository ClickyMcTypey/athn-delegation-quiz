import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        manifest: true,
        lib: {
            entry: 'src/app.js',
            name: 'AthenaDelegationQuiz',
            formats: ['iife'],
            fileName: () => 'athn-delegation-quiz.[hash].js',
        },
    },
});