import { ANIMATION, SELECTORS } from '../constants.js';
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
    const container = state.slideContainer;
    const firstSlide = state.slides[0];
    const loader = root.querySelector(SELECTORS.loader);

    if (!root || !container || !firstSlide) return;

    root.classList.remove('is-ready');
    root.setAttribute('aria-busy', 'true');

    const startHeight =
        loader?.getBoundingClientRect().height || ANIMATION.loadingHeight;

    container.style.height = `${startHeight}px`;
    container.style.overflow = 'hidden';

    firstSlide.style.display = 'block';
    firstSlide.style.visibility = 'hidden';
    firstSlide.style.opacity = '0';

    firstSlide.offsetHeight;

    const targetHeight = firstSlide.getBoundingClientRect().height;

    firstSlide.style.visibility = '';

    container.style.transition = `height ${ANIMATION.heightDuration}ms ${ANIMATION.fadeEase}`;
    firstSlide.style.transition = `opacity ${ANIMATION.initialFadeDuration}ms ${ANIMATION.fadeEase}`;

    if (loader) {
        loader.style.transition = `opacity ${ANIMATION.initialFadeDuration}ms ${ANIMATION.fadeEase}`;
    }

    container.offsetHeight;

    container.style.height = `${targetHeight}px`;

    if (loader) {
        loader.style.opacity = '0';
    }

    firstSlide.style.opacity = '1';

    const duration = Math.max(
        ANIMATION.heightDuration,
        ANIMATION.initialFadeDuration
    );

    window.setTimeout(() => {
        container.style.transition = '';
        container.style.height = 'auto';

        firstSlide.style.transition = '';
        firstSlide.style.opacity = '1';

        if (loader) {
            loader.style.display = 'none';
        }

        root.classList.add('is-ready');
        root.setAttribute('aria-busy', 'false');
    }, duration + 40);
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