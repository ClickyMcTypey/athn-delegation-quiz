import { SELECTORS } from '../constants.js';
import { qs, qsa } from '../utils/dom.js';
import { setupInitialSlides } from './steps.js';
import { setupValidation } from './validation.js';
import { setupNavigation } from './navigation.js';
import { fadeInQuiz } from './animation.js';
import { setupHubSpotCallbacks } from './hubspot.js';

export function initQuiz() {
    const root = qs(SELECTORS.root);
    if (!root) return null;

    const slideContainer = qs(SELECTORS.slideContainer, root);
    const slides = qsa(SELECTORS.slide, root);

    if (!slideContainer || !slides.length) {
        console.warn('[Delegation Quiz] Missing slide container or slides.');
        return null;
    }

    const state = {
        root,
        slideContainer,
        slides,
        currentIndex: 0,
        isAnimating: false,
        answers: {},
    };

    setupInitialSlides(state);
    setupValidation(state);
    setupNavigation(state);
    fadeInQuiz(state);

    console.log('[Delegation Quiz] Initialized', state);

    return state;
}