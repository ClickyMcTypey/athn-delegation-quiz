import { HUBSPOT_FIELDS, SELECTORS, THANK_YOU_URL } from '../constants.js';
import { log, warn } from '../utils/logger.js';

function getAvailableFieldNames(root) {
    return Array.from(root.querySelectorAll('input, select, textarea'))
        .map((field) => field.name)
        .filter(Boolean);
}

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
    if (!state.result) {
        warn('HubSpot sync skipped: no quiz result yet');
        return false;
    }

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

    const payload = {
        totalSynced,
        labelSynced,
        result: state.result,
        expectedFields: HUBSPOT_FIELDS,
        availableFields: getAvailableFieldNames(root),
    };

    if (!totalSynced || !labelSynced) {
        warn('HubSpot sync incomplete', payload);
        return false;
    }

    log('HubSpot sync successful', payload);
    return true;
}

export function moveEducationBlockBeforeSubmit(state) {
    const educationBlock = document.querySelector(SELECTORS.educationBlock);
    const submitBlock = state.root.querySelector(SELECTORS.hubspotSubmit);

    if (!educationBlock || !submitBlock) return false;

    submitBlock.parentNode.insertBefore(educationBlock, submitBlock);

    console.log('[Delegation Quiz] Education block moved before HubSpot submit');

    return true;
}

export function setupEducationBlockMove(state) {
    const tryMove = () => moveEducationBlockBeforeSubmit(state);

    if (tryMove()) return;

    const observer = new MutationObserver(() => {
        if (tryMove()) {
            observer.disconnect();
        }
    });

    observer.observe(state.root, {
        childList: true,
        subtree: true,
    });
}

export function setupHubSpotMessageLogger() {
    window.addEventListener('message', (event) => {
        const data = event.data;

        if (!data || data.type !== 'hsFormCallback') return;

        log('HubSpot global message event', {
            eventName: data.eventName,
            id: data.id,
            data,
        });
    });
}

export function setupHubSpotCallbacks(state) {
    window.AthenaDelegationQuiz = window.AthenaDelegationQuiz || {};

    window.AthenaDelegationQuiz.onHubSpotReady = function ($form) {
        log('HubSpot callback: onFormReady', {
            form: $form,
            hasResult: Boolean(state.result),
        });

        moveEducationBlockBeforeSubmit?.(state);

        if (state.result) {
            syncResultToHubSpot(state);
        }
    };

    window.AthenaDelegationQuiz.onHubSpotBeforeSubmit = function ($form) {
        log('HubSpot callback: onBeforeFormSubmit', {
            form: $form,
            result: state.result,
        });

        syncResultToHubSpot(state);
    };

    window.AthenaDelegationQuiz.onHubSpotSubmitted = function ($form) {
        log('HubSpot callback: onFormSubmitted. Redirecting...', {
            form: $form,
            result: state.result,
            thankYouUrl: THANK_YOU_URL,
        });

        window.location.assign(THANK_YOU_URL);
    };
}