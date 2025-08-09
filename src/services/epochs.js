import { providerLimiter } from './limiter.js';
import axios from 'axios';
import { config } from '../config.js';

const base = config.network === 'mainnet'
    ? 'https://cardano-mainnet.blockfrost.io/api/v0'
    : 'https://cardano-preprod.blockfrost.io/api/v0';

const client = axios.create({ baseURL: base, headers: { project_id: process.env.BLOCKFROST_API_KEY } });
const get = (p) => providerLimiter.schedule(() => client.get(p).then(r => r.data));

let lastEpoch = null;
export async function checkEpochChange() {
    const latest = await get('/epochs/latest');
    if (!latest?.epoch) return null;
    if (lastEpoch === null) lastEpoch = latest.epoch;
    if (latest.epoch > lastEpoch) {
        const prev = lastEpoch; lastEpoch = latest.epoch;
        return { prevEpoch: prev, newEpoch: latest.epoch };
    }
    return null;
}
