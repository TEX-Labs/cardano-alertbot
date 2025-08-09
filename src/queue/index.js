import { Queue, Worker, QueueScheduler } from 'bullmq';
import IORedis from 'ioredis';
import { config } from '../config.js';
import { logger } from '../logger.js';
import { jobPollAddress, jobPollStakeKey, jobPollPool } from './jobs.js';

const connection = new IORedis(process.env.REDIS_URL);

export const qPoll = new Queue('poll', { connection });
new QueueScheduler('poll', { connection });

export function startWorkers() {
    new Worker('poll', async (job) => {
        if (job.name === 'pollAddress') return jobPollAddress(job.data);
        if (job.name === 'pollStakeKey') return jobPollStakeKey(job.data);
        if (job.name === 'pollPool') return jobPollPool(job.data);
    }, { connection, concurrency: 5 });

    logger.info('Queue workers started');
}
