import axios from 'axios';
import CircuitBreaker from 'opossum';
import { providerLimiter } from './limiter.js';

function mkClient(baseURL, headers = {}) {
    const c = axios.create({ baseURL, headers, timeout: 10000 });
    return (path) => providerLimiter.schedule(() => c.get(path).then(r => r.data));
}

// Primary: Blockfrost
const bf = mkClient(process.env.CARDANO_NETWORK === 'mainnet'
    ? 'https://cardano-mainnet.blockfrost.io/api/v0'
    : 'https://cardano-preprod.blockfrost.io/api/v0',
    { project_id: process.env.BLOCKFROST_API_KEY }
);

// Secondary: Koios (ví dụ preprod URL có thể khác nhau tùy triển khai)
const koios = mkClient('https://api.koios.rest/api/v1');

async function tryProviders(path) {
    try { return await bf(path); }
    catch (_) { return await koios(path); }
}

const breaker = new CircuitBreaker(tryProviders, { timeout: 12000, errorThresholdPercentage: 50, resetTimeout: 10000 });

export const safeGet = (path) => breaker.fire(path);
