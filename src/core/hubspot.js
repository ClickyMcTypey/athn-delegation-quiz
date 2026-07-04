import { HUBSPOT_FIELDS, SELECTORS } from '../constants.js';

function getHubSpotRoot(state) {
    return state.root.querySelector(SELECTORS.hubspotForm) || state.root;
}

function getField(root, fieldName) {
    return root.querySelector(`[name="${fieldName}"]`);
}

function setFieldValue(root, fieldName, value) {
    const field = getField(root, fieldName);

    if (!field) {
        return false;
    }

    field.value = value ?? '';

    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
}

function getAvailableFieldNames(root) {
    return Array.from(root.querySelectorAll('input, select, textarea'))
        .map((field) => field.name)
        .filter(Boolean);
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

    const isSynced = totalSynced && labelSynced;

    console.log('[Delegation Quiz] HubSpot sync', {
        totalSynced,
        labelSynced,
        result: state.result,
        expectedFields: HUBSPOT_FIELDS,
        availableFields: getAvailableFieldNames(root),
    });

    return isSynced;
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