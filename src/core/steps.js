import { CLASSES, SELECTORS } from '../constants.js';
import { animateToSlide } from './animation.js';
import { updateProgressBar } from './progress.js';
import { animateToCustomSlide } from './animation.js';

export function goToResultSlide(state, resultKey) {
    const resultSlide = getResultSlide(state, resultKey);

    if (!resultSlide) {
        console.warn('[Delegation Quiz] Missing result slide', resultKey);
        return;
    }

    return animateToCustomSlide(state, resultSlide);
}

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
        slide.style.transform = 'none';
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if ('inert' in slide) {
            slide.inert = !isActive;
        }
    });

    state.currentIndex = targetIndex;
    updateProgressBar(state);
}

export function goToNextSlide(state) {
    if (state.isAnimating) return;
    return animateToSlide(state, state.currentIndex + 1);
}

export function goToPrevSlide(state) {
    if (state.isAnimating) return;
    return animateToSlide(state, state.currentIndex - 1);
}

export function getResultSlide(state, resultKey) {
    return state.resultSlides?.find((slide) => {
        return slide.getAttribute('result') === resultKey;
    });
}



export function setupInitialSlides(state) {
    state.slides.forEach((slide, index) => {
        const isActive = index === 0;

        slide.style.display = isActive ? 'block' : 'none';
        slide.style.opacity = '0';
        slide.style.transform = 'none';
        slide.style.visibility = isActive ? 'hidden' : '';
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');

        if ('inert' in slide) {
            slide.inert = !isActive;
        }

        state.resultSlides?.forEach((slide) => {
            slide.style.display = 'none';
            slide.style.opacity = '0';
            slide.style.transform = 'none';
            slide.setAttribute('aria-hidden', 'true');

            if ('inert' in slide) {
                slide.inert = true;
            }
        });

        const prevButton = slide.querySelector(SELECTORS.prevButton);
        const nextButton = slide.querySelector(SELECTORS.nextButton);

        setButtonState(prevButton, index !== 0);

        if (nextButton) {
            setButtonState(nextButton, false);
        }
    });

    state.currentIndex = 0;
    updateProgressBar(state);
}