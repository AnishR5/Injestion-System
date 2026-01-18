import {
  IsString,
  IsNotEmpty,
  IsISO8601,
  IsOptional,
  IsObject,
  IsUUID,
} from 'class-validator';

export class CreateEventDto {
  @IsOptional()
  @IsUUID()
  eventId?: string; // optional for idempotency

  @IsString()
  @IsNotEmpty()
  eventType: string;

  @IsISO8601()
  timestamp: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
