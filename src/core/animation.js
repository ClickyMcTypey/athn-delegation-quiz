import { ANIMATION, SELECTORS } from '../constants.js';
import { updateProgressBar } from './progress.js';

function getSlideHeight(slide, fallbackHeight = 320) {
    if (!slide) return fallbackHeight;

    const previous = {
        display: slide.style.display,
        visibility: slide.style.visibility,
        opacity: slide.style.opacity,
        position: slide.style.position,
        height: slide.style.height,
    };

    slide.style.display = 'block';
    slide.style.visibility = 'hidden';
    slide.style.opacity = '0';
    slide.style.position = 'relative';
    slide.style.height = 'auto';

    const height = slide.scrollHeight || slide.getBoundingClientRect().height;

    slide.style.display = previous.display;
    slide.style.visibility = previous.visibility;
    slide.style.opacity = previous.opacity;
    slide.style.position = previous.position;
    slide.style.height = previous.height;

    if (!height || height < 1) {
        console.warn('[Delegation Quiz] Slide measured as 0 height', slide);
        return fallbackHeight;
    }

    return height;
}

function getActiveSlideHeight(slide, fallbackHeight = 320) {
    if (!slide) return fallbackHeight;

    const height = slide.scrollHeight || slide.getBoundingClientRect().height;

    if (!height || height < 1) {
        return fallbackHeight;
    }

    return height;
}

function watchActiveSlideHeight(state, slide) {
    if (state.activeResizeObserver) {
        state.activeResizeObserver.disconnect();
    }

    if (!window.ResizeObserver || !slide) return;

    state.activeResizeObserver = new ResizeObserver(() => {
        if (state.isAnimating) return;

        const currentContainerHeight =
            state.slideContainer.getBoundingClientRect().height || 320;

        const height = getActiveSlideHeight(slide, currentContainerHeight);

        if (!height || height < 1) return;

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
        loader?.getBoundingClientRect().height || ANIMATION.loadingHeight || 320;

    container.style.height = `${startHeight}px`;
    container.style.overflow = 'hidden';
    container.style.transition = '';

    firstSlide.style.display = 'block';
    firstSlide.style.visibility = 'hidden';
    firstSlide.style.opacity = '0';
    firstSlide.style.transform = 'none';

    firstSlide.offsetHeight;

    const targetHeight = getSlideHeight(
        firstSlide,
        ANIMATION.loadingHeight || 320
    );

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
        container.style.overflow = 'hidden';

        firstSlide.style.transition = '';
        firstSlide.style.opacity = '1';
        firstSlide.style.visibility = '';

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
        state.root.classList.add('is-transitioning');

        const container = state.slideContainer;
        const currentHeight = container.getBoundingClientRect().height || 320;

        container.style.height = `${currentHeight}px`;
        container.style.overflow = 'hidden';
        container.style.transition = '';

        container.offsetHeight;

        targetSlide.style.display = 'block';
        targetSlide.style.opacity = '0';
        targetSlide.style.transform = 'none';
        targetSlide.style.visibility = 'hidden';
        targetSlide.setAttribute('aria-hidden', 'false');

        if ('inert' in currentSlide) {
            currentSlide.inert = true;
        }

        if ('inert' in targetSlide) {
            targetSlide.inert = true;
        }

        targetSlide.offsetHeight;

        const targetHeight = getSlideHeight(targetSlide, currentHeight);

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

            if ('inert' in currentSlide) {
                currentSlide.inert = true;
            }

            targetSlide.style.transition = '';
            targetSlide.style.opacity = '1';
            targetSlide.style.visibility = '';

            container.style.transition = '';
            container.style.height = `${targetHeight}px`;
            container.style.overflow = 'hidden';

            state.currentIndex = targetIndex;
            state.activeResultSlide = null;
            state.isAnimating = false;
            state.root.classList.remove('is-transitioning');

            if ('inert' in targetSlide) {
                targetSlide.inert = false;
            }

            watchActiveSlideHeight(state, targetSlide);
            updateProgressBar(state);

            resolve(true);
        }, duration + 40);
    });
}

export function animateToCustomSlide(state, targetSlide) {
    return new Promise((resolve) => {
        const currentSlide = state.slides[state.currentIndex];

        if (!currentSlide || !targetSlide) {
            resolve(false);
            return;
        }

        state.isAnimating = true;
        state.root.classList.add('is-transitioning');

        const container = state.slideContainer;
        const currentHeight = container.getBoundingClientRect().height || 320;

        container.style.height = `${currentHeight}px`;
        container.style.overflow = 'hidden';
        container.style.transition = '';

        container.offsetHeight;

        targetSlide.style.display = 'block';
        targetSlide.style.opacity = '0';
        targetSlide.style.transform = 'none';
        targetSlide.style.visibility = 'hidden';
        targetSlide.setAttribute('aria-hidden', 'false');

        if ('inert' in currentSlide) {
            currentSlide.inert = true;
        }

        if ('inert' in targetSlide) {
            targetSlide.inert = true;
        }

        targetSlide.offsetHeight;

        const targetHeight = getSlideHeight(targetSlide, currentHeight);

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

            if ('inert' in currentSlide) {
                currentSlide.inert = true;
            }

            targetSlide.style.transition = '';
            targetSlide.style.opacity = '1';
            targetSlide.style.visibility = '';

            container.style.transition = '';
            container.style.height = `${targetHeight}px`;
            container.style.overflow = 'hidden';

            state.activeResultSlide = targetSlide;
            state.isAnimating = false;
            state.root.classList.remove('is-transitioning');

            if ('inert' in targetSlide) {
                targetSlide.inert = false;
            }

            watchActiveSlideHeight(state, targetSlide);

            resolve(true);
        }, duration + 40);
    });
}