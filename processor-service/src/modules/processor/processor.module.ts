import { Module } from '@nestjs/common';
import { ProcessorService } from './processor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StreamConsumer } from './stream.consumer';
import { EventMetadata } from './entities/event-metadata.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EventMetadata])],
  providers: [ProcessorService, StreamConsumer],
})
export class ProcessorModule {}
