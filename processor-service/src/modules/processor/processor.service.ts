import { Injectable, Logger } from '@nestjs/common';
import { redisClient } from 'src/config/redis.config';


@Injectable()
export class ProcessorService {
  private readonly logger = new Logger(ProcessorService.name);

  async processBatch(messages: any[]) {
    for (const [id, fields] of messages) {
      try {
        const event = this.parse(fields);
        await this.handleEvent(event);

        await redisClient.xack('events:ingestion', 'event-processors', id);
      } catch (error) {
        await this.handleFailure(id, fields, error);
      }
    }
  }

  private parse(fields: any[]) {
    const obj: any = {};
    for (let i = 0; i < fields.length; i += 2) {
      obj[fields[i]] = fields[i + 1];
    }
    obj.retryCount = Number(obj.retryCount || 0);
    obj.payload = JSON.parse(obj.payload);
    return obj;
  }

  private async handleEvent(event: any) {
    // Placeholder: DB + OpenSearch writes (STEP 8)
    this.logger.log(`Processing event ${event.eventId}`);
  }
}
