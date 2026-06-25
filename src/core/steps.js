import { CLASSES, SELECTORS } from '../constants.js';

export function setButtonState(button, isEnabled) {
    if (!button) return;

    const mask = button.closest(SELECTORS.buttonMask);

    button.disabled = !isEnabled;

    if (mask) {
        mask.classList.toggle(CLASSES.disabled, !isEnabled);
    }
}

export function showSlide(state, targetIndex) {
    state.slides.forEach((slide, index) => {
        const isActive = index === targetIndex;

        slide.style.display = isActive ? 'block' : 'none';
        slide.style.opacity = isActive ? '1' : '0';
        slide.style.transform = 'translateX(0)';
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        // Prevent keyboard focus inside hidden slides.
        if ('inert' in slide) {
            slide.inert = !isActive;
        }
    });

    state.currentIndex = targetIndex;
}

export function setupInitialSlides(state) {
    showSlide(state, 0);

    state.slides.forEach((slide, index) => {
        const prevButton = slide.querySelector(SELECTORS.prevButton);
        const nextButton = slide.querySelector(SELECTORS.nextButton);

        setButtonState(prevButton, index !== 0);

        // Question Next buttons start disabled.
        if (nextButton) {
            setButtonState(nextButton, false);
        }
    });
}