import {
  ArrayNotEmpty,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEventDto } from './create-event.dto';

export class BatchEventDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => CreateEventDto)
  events: CreateEventDto[];
}
