import { SELECTORS } from '../constants.js';

function isFormSlide(slide) {
    return slide?.getAttribute('slide') === 'form';
}

function getQuestionSlides(slides) {
    return slides.filter((slide) => !isFormSlide(slide));
}

function getProgressPercent(state) {
    const currentSlide = state.slides[state.currentIndex];
    const questionSlides = getQuestionSlides(state.slides);

    if (!currentSlide || !questionSlides.length) return 0;

    if (isFormSlide(currentSlide)) return 100;

    const questionIndex = questionSlides.indexOf(currentSlide);

    if (questionIndex === -1) return 0;

    return Math.round(((questionIndex + 1) / questionSlides.length) * 100);
}

export function updateProgressBar(state) {
    const progressBar = state.root.querySelector(SELECTORS.progressBar);
    if (!progressBar) return;

    const percent = getProgressPercent(state);

    progressBar.style.width = `${percent}%`;

    progressBar.setAttribute('role', 'progressbar');
    progressBar.setAttribute('aria-valuemin', '0');
    progressBar.setAttribute('aria-valuemax', '100');
    progressBar.setAttribute('aria-valuenow', String(percent));

    console.log('[Delegation Quiz] Progress updated', percent);
}