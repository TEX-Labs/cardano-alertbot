/**
 * Centralized configuration loader.
 * All environment variables should be read here.
 */
import 'dotenv/config';

export const config = {
  telegramToken: process.env.TELEGRAM_BOT_TOKEN,
  blockfrostKey: process.env.BLOCKFROST_API_KEY,
  network: process.env.CARDANO_NETWORK || 'preprod', // or 'mainnet'
  pollInterval: Number(process.env.POLL_INTERVAL_MS || 15000),
};
