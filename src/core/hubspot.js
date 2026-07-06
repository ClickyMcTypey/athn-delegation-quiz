import { HUBSPOT_FIELDS, SELECTORS, THANK_YOU_URL } from '../constants.js';

function getHubSpotRoot(state) {
    return state.root.querySelector(SELECTORS.hubspotForm) || state.root;
}

function setFieldValue(root, fieldName, value) {
    const field = root.querySelector(`[name="${fieldName}"]`);
    if (!field) return false;

    field.value = value ?? '';
    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
}

export function syncResultToHubSpot(state) {
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
        console.log('[Delegation Quiz] HubSpot submitted, redirecting');

        window.location.href = THANK_YOU_URL;
    };
}