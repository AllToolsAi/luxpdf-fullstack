import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_URL,
    token: process.env.UPSTASH_REDIS_TOKEN,
});

export const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '10 s'),
    analytics: true,
    prefix: 'rl:code-converter'
});

export async function applyRateLimit(req, res) {
    const identifier = req.ip ?? '127.0.0.1';
    const { success } = await ratelimit.limit(identifier);

    if (!success) {
        res.setHeader('X-RateLimit-Limit', '10 requests per 10 seconds');
        return new Response('Too many requests', { status: 429 });
    }

    return null;
}
