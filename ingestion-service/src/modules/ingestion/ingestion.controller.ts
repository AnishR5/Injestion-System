import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { CreateEventDto } from './dto/create-event.dto';
import { BatchEventDto } from './dto/batch-event.dto';
import { ApiKeyGuard } from 'src/common/guards/api-key.guard';
import { RateLimitGuard } from 'src/common/guards/rate-limit.guard';

@Controller('events')
@UseGuards(ApiKeyGuard, RateLimitGuard)
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post()
  ingestSingle(@Body() dto: CreateEventDto, @Req() req: any) {
    return this.ingestionService.ingestSingle(dto, req);
  }

  @Post('batch')
  ingestBatch(@Body() dto: BatchEventDto) {
    return this.ingestionService.ingestBatch(dto);
  }
}
