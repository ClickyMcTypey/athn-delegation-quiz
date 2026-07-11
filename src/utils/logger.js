import { DEBUG } from '../constants.js';

const PREFIX = '[Delegation Quiz]';

export function log(message, data) {
    if (!DEBUG) return;

    if (data !== undefined) {
        console.log(`${PREFIX} ${message}`, data);
        return;
    }

    console.log(`${PREFIX} ${message}`);
}

export function warn(message, data) {
    if (!DEBUG) return;

    if (data !== undefined) {
        console.warn(`${PREFIX} ${message}`, data);
        return;
    }

    console.warn(`${PREFIX} ${message}`);
}

export function error(message, data) {
    if (!DEBUG) return;

    if (data !== undefined) {
        console.error(`${PREFIX} ${message}`, data);
        return;
    }

    console.error(`${PREFIX} ${message}`);
}