/**
 * Entry point for Cardano AlertBot.
 * This minimal MVP wires up a Telegraf bot with simple commands.
 */
import { Telegraf } from 'telegraf';
import { config } from './config.js';
import { logger } from './logger.js';
import { registerCommands } from './routes/commands.js';

if (!config.telegramToken) {
  console.error('TELEGRAM_BOT_TOKEN is missing'); process.exit(1);
}
if (!config.blockfrostKey) {
  console.error('BLOCKFROST_API_KEY is missing'); process.exit(1);
}

const bot = new Telegraf(config.telegramToken);

// Register commands and handlers
registerCommands(bot);

// Launch the bot (long polling)
bot.launch().then(() => {
  logger.info(`Bot started on ${config.network}, polling interval ${config.pollInterval}ms`);
});

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
