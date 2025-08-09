import Bottleneck from 'bottleneck';

// Global limiter cho provider (ví dụ 60 req/phút)
export const providerLimiter = new Bottleneck({ minTime: 1000 }); // ~60r/min

// Per-user limiter (tuỳ biến theo chatId)
const userLimiters = new Map();
export function forUser(chatId) {
    if (!userLimiters.has(chatId)) userLimiters.set(chatId, new Bottleneck({ minTime: 500 }));
    return userLimiters.get(chatId);
}
