/**
 * Telegram command registration.
 * Keep the UX simple and provide helpful guidance.
 */
import { Markup } from 'telegraf';
import { getLatestTxs, getStakeRewards } from '../services/blockfrost.js';

export function registerCommands(bot) {
  bot.start((ctx) => {
    ctx.reply(
      'Welcome to Cardano AlertBot!\n\n' +
      'Commands:\n' +
      '/watchaddr <addr1...> — fetch latest transactions\n' +
      '/watchstake <stake1...> — fetch latest reward\n' +
      '/ping — health check',
      Markup.keyboard([['/ping']]).resize()
    );
  });

  bot.command('ping', (ctx) => ctx.reply('pong ✅'));

  bot.hears(/\/watchaddr (addr1[0-9a-zA-Z]+)/, async (ctx) => {
    const address = ctx.match[1];
    await ctx.reply(`Tracking address: ${address}\nFetching latest transactions...`);
    try {
      const txs = await getLatestTxs(address);
      if (!txs.length) return ctx.reply('No recent transactions found.');
      const tx = txs[0];
      const url = `https://cardanoscan.io/transaction/${tx.tx_hash}`;
      await ctx.reply(`Latest transaction: ${tx.tx_hash}\n${url}`);
    } catch (err) {
      await ctx.reply('Failed to fetch transactions. Please try again later.');
    }
  });

  bot.hears(/\/watchstake (stake1[0-9a-zA-Z]+)/, async (ctx) => {
    const stakeKey = ctx.match[1];
    await ctx.reply(`Tracking stake key: ${stakeKey}\nFetching last reward...`);
    try {
      const rewards = await getStakeRewards(stakeKey);
      if (!rewards.length) return ctx.reply('No reward data found yet.');
      const { epoch, amount } = rewards[0];
      await ctx.reply(`Latest reward: ${Number(amount) / 1e6} ADA at epoch ${epoch}`);
    } catch (err) {
      await ctx.reply('Failed to fetch rewards. Please try again later.');
    }
  });
}
