import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'src/app.js',
            name: 'DelegationQuiz',
            formats: ['iife'],
            fileName: () => 'delegation-quiz.js',
        },
    },
});