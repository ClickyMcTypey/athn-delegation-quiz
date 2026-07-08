import { SELECTORS } from '../constants.js';

function isFormSlide(slide) {
    return slide?.getAttribute('slide') === 'form';
}

function getQuestionSlides(slides) {
    return slides.filter((slide) => !isFormSlide(slide));
}

function getProgressData(state) {
    const currentSlide = state.slides[state.currentIndex];
    const questionSlides = getQuestionSlides(state.slides);
    const total = questionSlides.length;

    if (!currentSlide || !total) {
        return {
            current: 0,
            total: 0,
            percent: 0,
        };
    }

    if (isFormSlide(currentSlide)) {
        return {
            current: total,
            total,
            percent: 100,
        };
    }

    const questionIndex = questionSlides.indexOf(currentSlide);
    const current = questionIndex === -1 ? 0 : questionIndex + 1;
    const percent = Math.round((current / total) * 100);

    return {
        current,
        total,
        percent,
    };
}

export function updateProgressBar(state) {
    const progressBar = state.root.querySelector(SELECTORS.progressBar);
    const progressCurrent = state.root.querySelector(SELECTORS.progressCurrent);
    const progressTotal = state.root.querySelector(SELECTORS.progressTotal);

    const { current, total, percent } = getProgressData(state);

    if (progressBar) {
        progressBar.style.width = `${percent}%`;

        progressBar.setAttribute('role', 'progressbar');
        progressBar.setAttribute('aria-valuemin', '0');
        progressBar.setAttribute('aria-valuemax', '100');
        progressBar.setAttribute('aria-valuenow', String(percent));
    }

    if (progressCurrent) {
        progressCurrent.textContent = String(current);
    }

    if (progressTotal) {
        progressTotal.textContent = String(total);
    }

    console.log('[Delegation Quiz] Progress updated', {
        current,
        total,
        percent,
    });
}