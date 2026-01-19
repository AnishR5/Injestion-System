import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEventDto } from './dto/create-event.dto';
import { BatchEventDto } from './dto/batch-event.dto';
import { PinoLogger } from 'nestjs-pino';
import { EventProducerService } from './stream/event-producer.service';

@Injectable()
export class IngestionService {
  constructor(
    private readonly logger: PinoLogger,
    private readonly producer: EventProducerService,
  ) {}

  ingest(payload: any) {
    return {
      status: 'accepted',
      eventId: randomUUID(),
    };
  }

  async ingestSingle(dto: CreateEventDto, req: any) {
    const eventId = dto.eventId ?? randomUUID();

    const event = {
      eventId,
      sourceId: req.source.id,
      payload: dto,
      correlationId: req.correlationId,
      retryCount: 0,
    };

    await this.producer.publish(event);

    this.logger.info(
      {
        eventId,
        sourceId: req.source.id,
        correlationId: req.correlationId,
      },
      'Event published to ingestion stream',
    );

    return {
      status: 'accepted',
      eventId,
    };
  }

  ingestBatch(dtos: BatchEventDto) {
    return {
      accepted: dtos.events.length,
      rejected: 0,
    };
  }
}
