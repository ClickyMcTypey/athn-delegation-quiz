import { HUBSPOT_FIELDS, SELECTORS, THANK_YOU_URL } from '../constants.js';

function getHubSpotRoot(state) {
    return state.root.querySelector(SELECTORS.hubspotForm) || state.root;
}

function getField(root, fieldName) {
    return root.querySelector(`[name="${fieldName}"]`);
}

function setFieldValue(root, fieldName, value) {
    const field = getField(root, fieldName);

    if (!field) return false;

    field.value = value ?? '';

    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
}

function syncOnce(state) {
    if (!state.result) return false;

    const root = getHubSpotRoot(state);

    const totalSynced = setFieldValue(
        root,
        HUBSPOT_FIELDS.totalScore,
        state.result.totalScore
    );

    const labelSynced = setFieldValue(
        root,
        HUBSPOT_FIELDS.resultLabel,
        state.result.resultLabel
    );

    console.log('[Delegation Quiz] HubSpot sync', {
        totalSynced,
        labelSynced,
        result: state.result,
    });

    return totalSynced && labelSynced;
}

export function syncResultToHubSpot(state) {
    const didSync = syncOnce(state);

    if (didSync) return true;

    let attempts = 0;
    const maxAttempts = 20;
    const delay = 250;

    const intervalId = window.setInterval(() => {
        attempts += 1;

        const didRetrySync = syncOnce(state);

        if (didRetrySync || attempts >= maxAttempts) {
            window.clearInterval(intervalId);
        }
    }, delay);

    return false;
}

export function setupHubSpotCallbacks(state) {
    window.AthenaDelegationQuiz = window.AthenaDelegationQuiz || {};

    window.AthenaDelegationQuiz.onHubSpotReady = function () {
        console.log('[Delegation Quiz] HubSpot ready');

        if (state.result) {
            syncResultToHubSpot(state);
        }
    };

    window.AthenaDelegationQuiz.onHubSpotBeforeSubmit = function () {
        console.log('[Delegation Quiz] HubSpot before submit');

        if (state.result) {
            syncResultToHubSpot(state);
        }
    };

    window.AthenaDelegationQuiz.onHubSpotSubmitted = function () {
        console.log('[Delegation Quiz] HubSpot submitted');

        window.location.href = THANK_YOU_URL;
    };
}