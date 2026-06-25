import { SELECTORS } from '../constants.js';
import { goToNextSlide, goToPrevSlide, getCurrentSlide } from './steps.js';
import { validateSlide } from './validation.js';

export function setupNavigation(state) {
    state.root.addEventListener('click', (event) => {
        const button = event.target.closest('button[cmd]');
        if (!button) return;

        const command = button.getAttribute('cmd');

        if (button.disabled) return;

        if (command === 'next') {
            const currentSlide = getCurrentSlide(state);
            const isValid = validateSlide(state, currentSlide);

            if (!isValid) return;

            goToNextSlide(state);
            return;
        }

        if (command === 'prev') {
            goToPrevSlide(state);
        }
    });
}