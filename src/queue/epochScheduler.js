import { checkEpochChange } from '../services/epochs.js';
import { qPoll } from './index.js';
import { logger } from '../logger.js';

// Chạy mỗi 60s để phát hiện epoch mới
export function startEpochWatcher(pools, bot) {
    setInterval(async () => {
        const change = await checkEpochChange().catch(() => null);
        if (change) {
            logger.info(`Epoch changed: ${change.prevEpoch} -> ${change.newEpoch}`);
            // lên job tổng kết cho từng pool đang theo dõi
            for (const poolId of pools) {
                await qPoll.add('pollPool', { chatId: /*chat id gắn với pool*/, poolId, bot });
            }
        }
    }, 60000);
}
