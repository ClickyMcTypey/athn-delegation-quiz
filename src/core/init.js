import { SELECTORS } from '../constants.js';
import { qs, qsa } from '../utils/dom.js';
import { setupInitialSlides } from './steps.js';
import { setupValidation } from './validation.js';
import { setupNavigation } from './navigation.js';
import { fadeInQuiz } from './animation.js';
import { setupHubSpotCallbacks, setupHubSpotMessageLogger, setupEducationBlockMove, } from './hubspot.js';
import { setupGeoIP } from './geoip.js';

export function initQuiz() {
    const root = qs(SELECTORS.root);
    if (!root) return null;

    const slideContainer = qs(SELECTORS.slideContainer, root);
    const slides = qsa(SELECTORS.slide, root);

    if (!slideContainer || !slides.length) {
        console.warn('[Delegation Quiz] Missing slide container or slides.');
        return null;
    }

    const resultSlides = qsa(SELECTORS.resultSlide, root);

    const state = {
        root,
        slideContainer,
        slides,
        currentIndex: 0,
        isAnimating: false,
        answers: {},
        resultSlides,
    };

    setupGeoIP(state);
    setupInitialSlides(state);
    setupValidation(state);
    setupNavigation(state);
    setupHubSpotCallbacks(state);
    setupHubSpotMessageLogger();
    fadeInQuiz(state);
    setupEducationBlockMove(state);

    console.log('[Delegation Quiz] Initialized', state);

    return state;
}