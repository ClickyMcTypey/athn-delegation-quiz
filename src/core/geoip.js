import { BANNED_COUNTRIES } from '../constants.js';

function normalizeCountryCode(value) {
    return String(value || '').trim().toUpperCase();
}

function getCountryFromPayload(payload) {
    return normalizeCountryCode(payload?.country_code);
}

function getGeoResult(payload) {
    const countryCode = getCountryFromPayload(payload);
    const isBanned = BANNED_COUNTRIES.includes(countryCode);

    return {
        countryCode,
        isBanned,
        status: countryCode ? 'success' : 'unknown',
    };
}

export function setupGeoIP(state) {
    state.geo = {
        countryCode: '',
        isBanned: false,
        status: 'loading',
    };

    if (window.DELEGATION_QUIZ_GEO) {
        state.geo = getGeoResult(window.DELEGATION_QUIZ_GEO);
        console.log('[Delegation Quiz] GeoIP result', state.geo);
        return;
    }

    window.addEventListener(
        'delegationQuiz:geoip',
        (event) => {
            state.geo = getGeoResult(event.detail);
            console.log('[Delegation Quiz] GeoIP result', state.geo);
        },
        { once: true }
    );

    window.setTimeout(() => {
        if (state.geo.status === 'loading') {
            state.geo = {
                countryCode: '',
                isBanned: false,
                status: 'timeout',
            };

            console.warn('[Delegation Quiz] GeoIP timed out; defaulting to allowed.');
        }
    }, 2500);
}