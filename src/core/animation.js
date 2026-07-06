import { ANIMATION, SELECTORS } from '../constants.js';
import { updateProgressBar } from './progress.js';

function getHeight(element) {
    return element.scrollHeight;
}

function animateContainerHeight(state, fromHeight, toHeight) {
    const container = state.slideContainer;

    container.style.height = `${fromHeight}px`;
    container.style.overflow = 'hidden';
    container.style.transition = `height ${ANIMATION.heightDuration}ms ${ANIMATION.fadeEase}`;

    container.offsetHeight;

    container.style.height = `${toHeight}px`;
}

function watchActiveSlideHeight(state, slide) {
    if (state.activeResizeObserver) {
        state.activeResizeObserver.disconnect();
    }

    if (!window.ResizeObserver || !slide) return;

    state.activeResizeObserver = new ResizeObserver(() => {
        if (state.isAnimating) return;

        const height = slide.getBoundingClientRect().height;
        state.slideContainer.style.height = `${height}px`;
    });

    state.activeResizeObserver.observe(slide);
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
        container.style.height = `${targetHeight}px`;
        firstSlide.style.transition = '';
        firstSlide.style.opacity = '1';

        if (loader) {
            loader.style.display = 'none';
        }

        watchActiveSlideHeight(state, firstSlide);

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

        const container = state.slideContainer;
        const currentHeight = container.getBoundingClientRect().height;

        // Lock current height before any slide visibility changes.
        container.style.height = `${currentHeight}px`;
        container.style.overflow = 'hidden';
        container.style.transition = '';
        container.offsetHeight;

        // Prepare target for measurement.
        targetSlide.style.display = 'block';
        targetSlide.style.opacity = '0';
        targetSlide.style.transform = 'none';
        targetSlide.style.visibility = 'hidden';
        targetSlide.setAttribute('aria-hidden', 'false');

        if ('inert' in targetSlide) targetSlide.inert = false;

        targetSlide.offsetHeight;

        const targetHeight = targetSlide.getBoundingClientRect().height;

        targetSlide.style.visibility = '';

        const heightTransition = `height ${ANIMATION.heightDuration}ms ${ANIMATION.fadeEase}`;
        const fadeTransition = `opacity ${ANIMATION.fadeDuration}ms ${ANIMATION.fadeEase}`;

        container.style.transition = heightTransition;
        currentSlide.style.transition = fadeTransition;
        targetSlide.style.transition = fadeTransition;

        container.offsetHeight;

        container.style.height = `${targetHeight}px`;
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

            container.style.transition = '';
            container.style.height = `${targetHeight}px`;
            state.currentIndex = targetIndex;
            state.isAnimating = false;
            watchActiveSlideHeight(state, targetSlide);

            updateProgressBar(state);

            resolve(true);
        }, duration + 40);
    });
}