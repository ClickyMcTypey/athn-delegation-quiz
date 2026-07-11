import { initQuiz } from './core/init.js';

function start() {
    const quiz = initQuiz();

    if (!quiz) return;

    window.AthenaDelegationQuiz = {
        ...(window.AthenaDelegationQuiz || {}),
        quiz,
    };
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}