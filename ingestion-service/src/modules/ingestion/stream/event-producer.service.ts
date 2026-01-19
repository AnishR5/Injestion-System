import { Injectable } from '@nestjs/common';
import { redisClient } from '../../../config/redis.config';

@Injectable()
export class EventProducerService {
  async publish(event: Record<string, any>) {
    await redisClient.xadd(
      'events:ingestion',
      '*',
      'eventId',
      event.eventId,
      'sourceId',
      event.sourceId,
      'payload',
      JSON.stringify(event.payload),
      'correlationId',
      event.correlationId,
      'retryCount',
      event.retryCount.toString(),
    );
  }
}
