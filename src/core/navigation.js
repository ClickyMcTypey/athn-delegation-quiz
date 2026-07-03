import { SELECTORS } from '../constants.js';
import { getCurrentSlide, goToNextSlide, goToPrevSlide } from './steps.js';
import { validateSlide } from './validation.js';
import { isFormSlide, updateQuizResult } from './scoring.js';
import { syncResultToHubSpot } from './hubspot.js';

export function setupNavigation(state) {
    state.root.addEventListener('click', async (event) => {
        const button = event.target.closest('button[cmd]');
        if (!button) return;

        const command = button.getAttribute('cmd');

        if (button.disabled || state.isAnimating) return;

        if (command === 'next') {
            const currentSlide = getCurrentSlide(state);
            const isValid = validateSlide(state, currentSlide);

            if (!isValid) return;

            await goToNextSlide(state);

            const nextSlide = getCurrentSlide(state);

            if (isFormSlide(nextSlide)) {
                updateQuizResult(state);
                syncResultToHubSpot(state);
            }

            return;
        }

        if (command === 'prev') {
            await goToPrevSlide(state);
        }
    });
}