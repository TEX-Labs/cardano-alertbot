/**
 * Blockfrost client helper functions.
 * NOTE: For production, consider adding retries/backoff and better error handling.
 */
import axios from 'axios';
import { config } from '../config.js';
import { providerLimiter } from './limiter.js';

const base = config.network === 'mainnet'
  ? 'https://cardano-mainnet.blockfrost.io/api/v0'
  : 'https://cardano-preprod.blockfrost.io/api/v0';

const client = axios.create({
  baseURL: base,
  headers: { project_id: config.blockfrostKey },
  timeout: 10000,
});

/**
 * Fetch latest transactions for an address.
 * Returns an array of transactions (newest first).
 */
export async function getLatestTxs(address) {
  const { data } = await client.get(`/addresses/${address}/transactions?order=desc&count=5`);
  return data;
}

/**
 * Fetch latest staking reward for a stake key.
 * Returns [{ epoch, amount }, ...] or empty array.
 */
export async function getStakeRewards(stakeKey) {
  const { data } = await client.get(`/accounts/${stakeKey}/rewards?order=desc&count=1`);
  return data;
}

const get = (path) => providerLimiter.schedule(() => client.get(path).then(r => r.data));
export async function getLatestTxs(address) { return get(`/addresses/${address}/transactions?order=desc&count=5`); }
export async function getStakeRewards(stakeKey) { return get(`/accounts/${stakeKey}/rewards?order=desc&count=1`); }