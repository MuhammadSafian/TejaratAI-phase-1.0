import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
    private redis: Redis;
    private readonly windowMs = 60 * 1000; // 1 minute window
    private readonly maxRequests = 60;      // 60 requests per minute

    constructor(private configService: ConfigService) {
        const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
        this.redis = new Redis(redisUrl);
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const key = `rate_limit:${ip}`;

        try {
            const current = await this.redis.incr(key);

            if (current === 1) {
                await this.redis.pexpire(key, this.windowMs);
            }

            const ttl = await this.redis.pttl(key);

            res.setHeader('X-RateLimit-Limit', this.maxRequests.toString());
            res.setHeader('X-RateLimit-Remaining', Math.max(0, this.maxRequests - current).toString());
            res.setHeader('X-RateLimit-Reset', Math.ceil(ttl / 1000).toString());

            if (current > this.maxRequests) {
                throw new HttpException(
                    { statusCode: 429, message: 'Too many requests. Please try again later.' },
                    HttpStatus.TOO_MANY_REQUESTS,
                );
            }

            next();
        } catch (error) {
            if (error instanceof HttpException) throw error;
            // If Redis is down, allow the request through (fail-open)
            next();
        }
    }
}
