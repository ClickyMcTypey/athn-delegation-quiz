import { SELECTORS } from '../constants.js';
import {
    getCurrentSlide,
    goToNextSlide,
    goToPrevSlide,
    goToResultSlide,
} from './steps.js';
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

            const nextIndex = state.currentIndex + 1;
            const nextSlide = state.slides[nextIndex];

            if (isFormSlide(nextSlide)) {
                updateQuizResult(state);

                // console.log('[Delegation Quiz] Route check', {
                //     geo: state.geo,
                //     result: state.result,
                // });

                if (state.geo?.isBanned && !state.geo?.isBypassed) {
                    await goToResultSlide(state, state.result.resultKey);
                    return;
                }

                await goToNextSlide(state);
                syncResultToHubSpot(state);
                return;
            }

            await goToNextSlide(state);
            return;
        }

        if (command === 'prev') {
            await goToPrevSlide(state);
        }
    });
}