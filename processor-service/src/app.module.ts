import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProcessorModule } from './modules/processor/processor.module';
import { databaseConfig } from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    ProcessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
