import { getLatestTxs, getStakeRewards } from '../services/blockfrost.js';
import { logger } from '../logger.js';
import { formatTxAlert, formatRewardAlert } from '../services/alerts.js';

export async function jobPollAddress({ chatId, address, bot }) {
    const txs = await getLatestTxs(address).catch(() => []);
    if (txs[0]) await bot.telegram.sendMessage(chatId, formatTxAlert(txs[0].tx_hash));
}

export async function jobPollStakeKey({ chatId, stakeKey, bot }) {
    const rewards = await getStakeRewards(stakeKey).catch(() => []);
    if (rewards[0]) {
        const { epoch, amount } = rewards[0];
        await bot.telegram.sendMessage(chatId, formatRewardAlert(epoch, amount));
    }
}

export async function jobPollPool({ chatId, poolId, bot }) {
    // placeholder: sẽ thêm pool metrics/epoch summary ở mục 3
    logger.debug(`Polling pool ${poolId} for chat ${chatId}`);
}
