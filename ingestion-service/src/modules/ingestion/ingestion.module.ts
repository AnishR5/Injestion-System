import { Module } from '@nestjs/common';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { EventProducerService } from './stream/event-producer.service';

@Module({
  controllers: [IngestionController],
  providers: [IngestionService, EventProducerService]
})
export class IngestionModule {}
