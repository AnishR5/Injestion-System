import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { redisClient } from 'src/config/redis.config';

@Injectable()
export class StreamConsumer implements OnModuleInit {
  private readonly STREAM = 'events:ingestion';
  private readonly GROUP = 'event-processors';
  private readonly CONSUMER = 'processor-1';

  constructor(private readonly processorService: ProcessorService) {}

  async onModuleInit() {
    await this.createConsumerGroup();
    this.consume();
  }

  private async createConsumerGroup() {
    try {
      await redisClient.xgroup(
        'CREATE',
        this.STREAM,
        this.GROUP,
        '0',
        'MKSTREAM',
      );
    } catch (err: any) {
      if (!err.message.includes('BUSYGROUP')) {
        throw err;
      }
    }
  }

  async consume() {
    while (true) {
      const data = await redisClient.xreadgroup(
      'GROUP',
      this.GROUP,
      this.CONSUMER,
      'STREAMS',
      this.STREAM,
      '>',
      'COUNT',
      10,
      'BLOCK',
      5000,
    ) as any; // 👈 temporary type cast

    if (!data) continue;

    const messages = data[0][1];
    await this.processorService.processBatch(messages);
    }
  }
}
