import { SELECTORS } from '../constants.js';
import { setButtonState } from './steps.js';

function getSelectedRadio(slide) {
    return slide.querySelector(`${SELECTORS.radio}:checked`);
}

function getAnswerLabel(radio) {
    const option = radio.closest(SELECTORS.option);
    const label = option?.querySelector('label');

    return label?.textContent?.trim() || radio.value;
}

function getAnswerData(slide, radio) {
    const score = Number(radio.dataset.score || 0);

    return {
        slide: slide.getAttribute('slide'),
        question: radio.name,
        value: radio.value,
        label: getAnswerLabel(radio),
        score,
    };
}

export function validateSlide(state, slide) {
    const nextButton = slide.querySelector(SELECTORS.nextButton);
    const radios = slide.querySelectorAll(SELECTORS.radio);

    // If this slide has no radio inputs, don't treat it as a question step.
    if (!radios.length) return true;

    const selectedRadio = getSelectedRadio(slide);
    const isValid = Boolean(selectedRadio);

    setButtonState(nextButton, isValid);

    if (selectedRadio) {
        const answer = getAnswerData(slide, selectedRadio);
        state.answers[answer.question] = answer;
    }

    return isValid;
}

export function setupValidation(state) {
    // Initialize validation state in case any radios are pre-selected.
    state.slides.forEach((slide) => {
        validateSlide(state, slide);
    });

    state.root.addEventListener('change', (event) => {
        const radio = event.target.closest?.(SELECTORS.radio);
        if (!radio) return;

        const slide = radio.closest(SELECTORS.slide);
        if (!slide) return;

        validateSlide(state, slide);

        //console.log('[Delegation Quiz] Answers updated', state.answers);
    });
}