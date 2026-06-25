import { CLASSES, SELECTORS } from '../constants.js';
import { animateToSlide } from './animation.js';

export function setButtonState(button, isEnabled) {
    if (!button) return;

    const mask = button.closest(SELECTORS.buttonMask);

    button.disabled = !isEnabled;

    if (mask) {
        mask.classList.toggle(CLASSES.disabled, !isEnabled);
    }
}

export function getCurrentSlide(state) {
    return state.slides[state.currentIndex] || null;
}

export function showSlide(state, targetIndex) {
    if (targetIndex < 0 || targetIndex >= state.slides.length) return;

    state.slides.forEach((slide, index) => {
        const isActive = index === targetIndex;

        slide.style.display = isActive ? 'block' : 'none';
        slide.style.opacity = isActive ? '1' : '0';
        slide.style.transform = 'translateX(0)';
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if ('inert' in slide) {
            slide.inert = !isActive;
        }
    });

    state.currentIndex = targetIndex;
}

export function goToNextSlide(state) {
    if (state.isAnimating) return;
    return animateToSlide(state, state.currentIndex + 1);
}

export function goToPrevSlide(state) {
    if (state.isAnimating) return;
    return animateToSlide(state, state.currentIndex - 1);
}

export function setupInitialSlides(state) {
    showSlide(state, 0);

    state.slides.forEach((slide, index) => {
        const prevButton = slide.querySelector(SELECTORS.prevButton);
        const nextButton = slide.querySelector(SELECTORS.nextButton);

        setButtonState(prevButton, index !== 0);

        if (nextButton) {
            setButtonState(nextButton, false);
        }
    });
}