import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateEventDto } from './dto/create-event.dto';
import { BatchEventDto } from './dto/batch-event.dto';

@Injectable()
export class IngestionService {

    ingest(payload: any) {
    return {
      status: 'accepted',
      eventId: randomUUID(),
    };
  }

  ingestSingle(dto: CreateEventDto) {
    const eventId = dto.eventId ?? randomUUID();

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
