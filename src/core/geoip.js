import { BANNED_COUNTRIES, GEOIP_ENDPOINT } from '../constants.js';

function normalizeCountryCode(value) {
    return String(value || '').trim().toUpperCase();
}

function getCountryFromPayload(payload) {
    return normalizeCountryCode(
        payload?.country ||
        payload?.country_code ||
        payload?.countryCode ||
        payload?.country_code_iso2
    );
}

export async function detectUserCountry() {
    if (!GEOIP_ENDPOINT) {
        return {
            countryCode: '',
            isBanned: false,
            status: 'skipped',
            error: 'Missing GEOIP_ENDPOINT',
        };
    }

    try {
        const response = await fetch(GEOIP_ENDPOINT, {
            method: 'GET',
            credentials: 'omit',
        });

        if (!response.ok) {
            throw new Error(`GeoIP request failed: ${response.status}`);
        }

        const payload = await response.json();
        const countryCode = getCountryFromPayload(payload);
        const isBanned = BANNED_COUNTRIES.includes(countryCode);

        return {
            countryCode,
            isBanned,
            status: 'success',
            error: '',
        };
    } catch (error) {
        console.warn('[Delegation Quiz] GeoIP failed', error);

        return {
            countryCode: '',
            isBanned: false,
            status: 'error',
            error: error?.message || 'Unknown GeoIP error',
        };
    }
}

export function setupGeoIP(state) {
    state.geo = {
        countryCode: '',
        isBanned: false,
        status: 'loading',
        error: '',
    };

    detectUserCountry().then((geo) => {
        state.geo = geo;

        console.log('[Delegation Quiz] GeoIP result', state.geo);
    });
}