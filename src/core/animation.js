import { ANIMATION } from '../constants.js';
import { updateProgressBar } from './progress.js';

function getHeight(element) {
    return element.getBoundingClientRect().height;
}

function animateContainerHeight(state, fromHeight, toHeight) {
    const container = state.slideContainer;

    container.style.height = `${fromHeight}px`;
    container.style.overflow = 'hidden';
    container.style.transition = `height ${ANIMATION.heightDuration}ms ${ANIMATION.fadeEase}`;

    container.offsetHeight;

    container.style.height = `${toHeight}px`;
}

export function fadeInQuiz(state) {
    const root = state.root;
    if (!root) return;

    root.style.opacity = '0';
    root.style.transition = `opacity ${ANIMATION.initialFadeDuration}ms ${ANIMATION.fadeEase}`;

    root.offsetHeight;

    root.style.opacity = '1';

    window.setTimeout(() => {
        root.style.transition = '';
    }, ANIMATION.initialFadeDuration + 40);
}

export function animateToSlide(state, targetIndex) {
    return new Promise((resolve) => {
        if (targetIndex < 0 || targetIndex >= state.slides.length) {
            resolve(false);
            return;
        }

        const currentSlide = state.slides[state.currentIndex];
        const targetSlide = state.slides[targetIndex];

        if (!currentSlide || !targetSlide || currentSlide === targetSlide) {
            resolve(false);
            return;
        }

        state.isAnimating = true;

        const currentHeight = getHeight(currentSlide);

        targetSlide.style.display = 'block';
        targetSlide.style.opacity = '0';
        targetSlide.style.transform = 'none';
        targetSlide.style.visibility = 'hidden';
        targetSlide.setAttribute('aria-hidden', 'false');

        if ('inert' in targetSlide) targetSlide.inert = false;

        targetSlide.offsetHeight;

        const targetHeight = getHeight(targetSlide);

        targetSlide.style.visibility = '';

        animateContainerHeight(state, currentHeight, targetHeight);

        const fadeTransition = `opacity ${ANIMATION.fadeDuration}ms ${ANIMATION.fadeEase}`;

        currentSlide.style.transition = fadeTransition;
        targetSlide.style.transition = fadeTransition;

        currentSlide.style.opacity = '0';
        targetSlide.style.opacity = '1';

        const duration = Math.max(ANIMATION.fadeDuration, ANIMATION.heightDuration);

        window.setTimeout(() => {
            currentSlide.style.display = 'none';
            currentSlide.style.transition = '';
            currentSlide.style.opacity = '0';
            currentSlide.setAttribute('aria-hidden', 'true');

            if ('inert' in currentSlide) currentSlide.inert = true;

            targetSlide.style.transition = '';
            targetSlide.style.opacity = '1';
            targetSlide.style.visibility = '';

            state.slideContainer.style.transition = '';
            state.slideContainer.style.height = 'auto';

            state.currentIndex = targetIndex;
            state.isAnimating = false;

            updateProgressBar(state);

            resolve(true);
        }, duration + 40);
    });
}