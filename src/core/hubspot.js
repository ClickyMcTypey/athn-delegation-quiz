import { HUBSPOT_FIELDS } from '../constants.js';

function setFieldValue(root, fieldName, value) {
    const field = root.querySelector(`[name="${fieldName}"]`);

    if (!field) {
        return false;
    }

    field.value = value ?? '';

    field.dispatchEvent(new Event('input', { bubbles: true }));
    field.dispatchEvent(new Event('change', { bubbles: true }));

    return true;
}

export function syncResultToHubSpot(state) {
    if (!state.result) return false;

    const totalSynced = setFieldValue(
        state.root,
        HUBSPOT_FIELDS.totalScore,
        state.result.totalScore
    );

    const labelSynced = setFieldValue(
        state.root,
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