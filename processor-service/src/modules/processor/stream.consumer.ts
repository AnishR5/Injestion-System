import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { redisClient } from 'src/config/redis.config';

@Injectable()
export class StreamConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly STREAM = 'events:ingestion';
  private readonly GROUP = 'event-processors';
  private readonly CONSUMER = 'processor-1';

  private readonly logger = new Logger(StreamConsumer.name);
  private isRunning = true;

  constructor(private readonly processorService: ProcessorService) {}

async onModuleInit() {
  this.logger.log('Initializing stream consumer...');

  // ✅ WAIT for Redis connection
  await this.waitForRedis();

  await this.createConsumerGroup();

  this.logger.log('Starting consumption loop...');
  this.consume();
}

  onModuleDestroy() {
    this.logger.log('Shutting down consumer...');
    this.isRunning = false;
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

      this.logger.log('Consumer group created');
    } catch (err: any) {
      if (err.message.includes('BUSYGROUP')) {
        this.logger.log('Consumer group already exists');
      } else {
        this.logger.error('Error creating consumer group', err);
        throw err;
      }
    }
  }

  private async waitForRedis() {
  let connected = false;

  while (!connected) {
    try {
      await redisClient.ping();
      connected = true;
      this.logger.log('Redis connected');
    } catch (err) {
      this.logger.warn('Waiting for Redis...');
      await new Promise(res => setTimeout(res, 1000));
    }
  }
}

  async consume() {
    while (this.isRunning) {
      try {
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
        ) as any;

        if (!data) continue;

        const messages = data[0][1];
        await this.processorService.processBatch(messages);

      } catch (err) {
        this.logger.error('Stream read error, retrying...', err);
        await new Promise(res => setTimeout(res, 2000));
      }
    }
  }
}