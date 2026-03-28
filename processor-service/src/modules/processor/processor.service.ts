import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { redisClient } from 'src/config/redis.config';
import { EventMetadata } from './entities/event-metadata.entity';
import { Repository } from 'typeorm';
import { openSearchClient } from '../../config/opensearch.config';
import { getEventIndex } from '../../common/utils/index-name.util';

@Injectable()
export class ProcessorService {
  constructor(
    @InjectRepository(EventMetadata)
  private readonly eventRepo: Repository<EventMetadata>,
) {}

  private readonly logger = new Logger(ProcessorService.name);

  
  private async bulkIndex(events: any[]) {
  const index = getEventIndex();

  const body = [];

  for (const event of events) {
    body.push({
      index: { _index: index, _id: event.eventId },
    });

    body.push({
      eventId: event.eventId,
      sourceId: event.sourceId,
      eventType: event.payload.eventType,
      timestamp: event.payload.timestamp,
      metadata: event.payload.metadata,
    });
  }

  const response = await openSearchClient.bulk({ body });

  if (response.body.errors) {
    this.logger.error('Bulk indexing had errors');
  }
}

async processBatch(messages: any[]) {
  const events = [];
  const messageIds = [];

  for (const [id, fields] of messages) {
    try {
      const event = this.parse(fields);

      const existing = await this.eventRepo.findOne({
        where: { id: event.eventId },
      });

      if (existing) {
        await redisClient.xack(
          'events:ingestion',
          'event-processors',
          id,
        );
        continue;
      }

      await this.eventRepo.save({
        id: event.eventId,
        sourceId: event.sourceId,
        eventType: event.payload.eventType,
        eventTime: new Date(event.payload.timestamp),
        status: 'PROCESSED',
      });

      events.push(event);
      messageIds.push(id);

    } catch (err) {
      await this.handleFailure(id, fields, err);
    }
  }

  if (events.length > 0) {
    await this.bulkIndex(events);
  }

  if (messageIds.length > 0) {
    await redisClient.xack(
      'events:ingestion',
      'event-processors',
      ...messageIds,
    );
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
  const existing = await this.eventRepo.findOne({
    where: { id: event.eventId },
  });

  if (existing) {
    return; 
  }

  await this.eventRepo.save({
    id: event.eventId,
    sourceId: event.sourceId,
    eventType: event.payload.eventType,
    eventTime: new Date(event.payload.timestamp),
    status: 'PROCESSED',
  });

  await openSearchClient.index({
  index: getEventIndex(),
  body: {
    eventId: event.eventId,
    sourceId: event.sourceId,
    eventType: event.payload.eventType,
    timestamp: event.payload.timestamp,
    metadata: event.payload.metadata,
  },
});

}

  private async handleFailure(messageId: string, fields: any[], error: any) {
    const event = this.parse(fields);

    if (event.retryCount < 3) {
      event.retryCount += 1;

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

      this.logger.warn(
        `Retrying event ${event.eventId}, attempt ${event.retryCount}`,
      );
    } else {
      await this.sendToDLQ(event);
    }

    await redisClient.xack('events:ingestion', 'event-processors', messageId);
  }

  private async sendToDLQ(event: any) {
    await redisClient.xadd(
      'events:dlq',
      '*',
      'eventId',
      event.eventId,
      'sourceId',
      event.sourceId,
      'payload',
      JSON.stringify(event.payload),
      'correlationId',
      event.correlationId,
      'failedAt',
      new Date().toISOString(),
    );

    this.logger.error(`Event ${event.eventId} moved to DLQ`);
  }
}
