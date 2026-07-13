export const SELECTORS = {
    root: '#mainquiz',
    slideContainer: '.quiz_slidecontainer',
    slide: '.quiz_slide[slide]',
    nextButton: '[cmd="next"]',
    prevButton: '[cmd="prev"]',
    radio: 'input[type="radio"]',
    buttonMask: '.quiz_buttonmask',
    option: '.quiz_option',
    hubspotForm: '#hubspotQuizForm',
    progressBar: '.quiz_progress_bar',
    progressCurrent: '#progress_current',
    progressTotal: '#progress_total',
    loader: '.quiz_loader',
    educationBlock: '#educ1',
    hubspotSubmit: '.hs_submit',
};

export const CLASSES = {
    disabled: 'disabled',
    active: 'is-active',
};

export const QUIZ_VERSION = '0.1.0';

export const ANIMATION = {
    fadeDuration: 300,
    fadeEase: 'ease',
    initialFadeDuration: 300,
    heightDuration: 300,
    loadingHeight: 96,
};

export const HUBSPOT_FIELDS = {
    totalScore: 'delegationquiz_score',
    resultLabel: 'delegationquiz_level',
};

export const THANK_YOU_URL = '/quiz/thank-you';

export const DEBUG = false;