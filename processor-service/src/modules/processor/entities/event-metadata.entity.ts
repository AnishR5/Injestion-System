import {
  Entity,
  Column,
  PrimaryColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('events_metadata')
export class EventMetadata {
  @PrimaryColumn()
  id: string;

  @Column()
  sourceId: string;

  @Column()
  eventType: string;

  @Column()
  eventTime: Date;

  @Column()
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}