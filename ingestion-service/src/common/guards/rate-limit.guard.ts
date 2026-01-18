import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { redisClient } from '../../config/redis.config';

@Injectable()
export class RateLimitGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const source = request.source;

    const limit = 100; // requests per minute (hardcoded for now)
    const windowSeconds = 60;

    const key = `rate:${source.id}`;

    const current = await redisClient.incr(key);

    if (current === 1) {
      await redisClient.expire(key, windowSeconds);
    }

    if (current > limit) {
      throw new HttpException(
        'Rate limit exceeded. Try again later.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
